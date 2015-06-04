#!/bin/sh
# Network testing script v 1.0
# (c) 2005 Javier Fernandez-Sanguino
#
# This script will test your system's network configuration using basic
# tests and providing both information (INFO messages), warnings (WARN)
# and possible errors (ERR messages) by checking:
# - Interface status
# - Availability of configured routers, including the default route
# - Proper host resolution, including DNS checks
# - Proper network connectivity (the remote host can be configured, see
#   below)
#
# The script does not need special privileges to run as it does not
# do any system change. It also will not fix the errors by itself.
#
#   This program is free software; you can redistribute it and/or modify
#   it under the terms of the GNU General Public License as published by
#   the Free Software Foundation; either version 2 of the License, or
#   (at your option) any later version.
#
#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU General Public License for more details.
#
#   You should have received a copy of the GNU General Public License
#   along with this program; if not, write to the Free Software
#   Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
#
# You can also find a copy of the GNU General Public License at
# http://www.gnu.org/licenses/licenses.html#TOCLGPL
#
# TODO
# - Works only on Linux, can this be generalised for other UNIX systems
#   (probably not unless rewritten in C)
# - Does not check for errors properly, use -e and test intensively
#   so that expected errors are trapped
#   (specially for tools that are not available, like netcat)
# - If the tools are localised to languages != english the script might
#   break
# - Ask 'host' maintainer to implement error codes as done with
#   dlint
# - Should be able to check if DNS server is in the same network, if
#   it doesn't answer to pings, check ARP in that case.
# - DHCP checks?
# - Other internal services tests? (LDAP if using pam...)
# - Generate summary of errors in the end (pretty report?)
# - Check if packets are being dropped by local firewall? (use dmesg
#   and look for our tests)
# - Support wireless interfaces? (use iwconfig)
# - Check other TODOs inline in the code


# BEGIN configuration
# Configure to your needs, these values will be used when
# checking DNS and Internet connectivity
# DNS name to resolve
CHECK_HOST=www.debian.org
CHECK_IP_ADRESS=194.109.137.218
# Web server to check for
CHECK_WEB_HOST=www.debian.org
CHECK_WEB_PORT=80
export CHECK_HOST CHECK_IP_ADRESS CHECK_WEB_HOST CHECK_WEB_PORT
# END configuration


# Extract the interface of our default route

defaultif=`netstat -nr |grep ^0.0.0.0 | awk '{print $8}' | head -1`
defaultroutes=`netstat -nr |grep ^0.0.0.0 | wc -l`
if [ -z "$defaultif" ] ; then
	defaultif=none
	echo "WARN: This system does not have a default route"
elif [ "$defaultroutes" -gt 1 ] ; then
	echo "WARN: This system has more than one default route"
else
	echo "INFO: This system has exactly one default route"
fi



# Check loopback
check_local () {
# Is there a loopback interface?
	if [ -n "`ip link show lo`" ] ; then
# OK, can we ping localhost
		if  ! check_host localhost 1; then
# Check 127.0.0.1  instead (not everybody uses this IP address however,
# although its the one commonly used)
			if  ! check_host 127.0.0.1 1; then
				echo "ERR: Cannot ping localhost (127.0.0.1), loopback is broken in this system"
			else
				echo "ERR: Localhost is not answering but 127.0.0.1, check /etc/hosts and verify localhost points to 127.0.0.1"
			fi
		else
		 echo "INFO: Loopback interface is working properly"
		fi

	else
		echo "ERR: There is no loopback interface in this system"
		status=1
	fi
	status=0
	return $status
}

# Check network interfaces
check_if () {
	ifname=$1
	status=0
	[ -z "$ifname" ] && return 1
# Find IP addresses for $ifname
	inetaddr=`ip addr show $ifname | grep inet | awk '{print $2}'`
	if [ -z "$inetaddr" ] ; then
		echo "WARN: The $ifname interface does not have an IP address assigned"
		status=1
	else
# TODO: WARN if more than 2 IP addresses?
		echo $inetaddr | while read ipaddr; do
			echo "INFO: The $ifname interface has IP address $ipaddr  assigned"
		done
	fi

# Lookup TX and RX statistics
# TODO: This is done using ifconfig but could use /proc/net/dev for
# more readibility or, better, 'netstat -i'
	txpkts=`ifconfig $ifname | awk '/RX packets/ { print $2 }' |sed 's/.*://'`
	rxpkts=`ifconfig $ifname | awk '/RX packets/ { print $2 }' |sed 's/.*://'`
	txerrors=`ifconfig $ifname | awk '/TX packets/ { print $3 }' |sed 's/.*://'`
	rxerrors=`ifconfig $ifname | awk '/RX packets/ { print $3 }' |sed 's/.*://'`
# TODO: Check also frames and collisions, to detect faulty cables
# or network devices (cheap hubs)
	if [ "$txpkts" -eq 0 ] && [ "$rxpkts" -eq 0 ] ; then
		echo "ERR: The $ifname interface has not tx or rx any packets. Link down?"
		status=1
	elif  [ "$txpkts" -eq 0 ]; then
		echo "WARN: The $ifname interface has not transmitted any packets."
	elif [ "$rxpkts" -eq 0 ] ; then
		echo "WARN: The $ifname interface has not received any packets."
	else
		echo "INFO: The $ifname interface has tx and rx  packets."
	fi
# TODO: It should be best if there was a comparison with tx/rx packets.
# a few errors are not uncommon if the card has been running for a long
# time. It would be better if a relative comparison was done (i.e.
# less than 1% ok, more than 20% warning, over 80% major issue, etc.)
	if [ "$txerrors" -ne 0 ]; then
		echo "WARN: The $ifname interface has tx errors."
	fi
	if [ "$rxerrors" -ne 0 ]; then
                echo "WARN: The $ifname interface has rx errors."
	fi
	return $status
}

check_netif () {
	status=0
	ip link show | egrep '^[[:digit:]]' |
	while read ifnumber ifname status extra; do
		ifname=`echo $ifname |sed -e 's/:$//'`
		if [ -z "`echo $status | grep UP\>`" ] ; then
			if  [ "$ifname" = "$defaultif" ] ; then
				echo "ERR: The $ifname interface that is associated with your defualt route is down!"
				status=1
			elif  [ "$ifname" = "lo"  ] ; then
				echo "ERR: Your lo inteface is down, this might cause issues with local applications (but not necessarily with network connectivity)"
			else
				echo "WARN: The $ifname interface is down"
			fi
		else
		# Check network routes associated with this interface
			echo "INFO: The $ifname interface is up"
			check_if $ifname
			check_netroute $ifname
		fi
	done
	return $status
}

check_netroute () {
	ifname=$1
	[ -z "$ifname" ] && return 1
	netstat -nr  | grep "${ifname}$" |
	while read network gw netmask flags mss window irtt iface; do
	# For each gw that is not the default one, ping it
		if [ "$gw" != "0.0.0.0" ] ; then
			if ! check_router $gw  ; then
				echo "ERR: The default route is not available since the default router is unreachable"
			fi
		fi
	done
}

check_router () {
# Checks if a router is up
	router=$1
	[ -z "$router" ] && return 1
	status=0
# First ping the router, if it does not answer then check arp tables and
# see if we have an arp. We use 5 packets since it is in our local network.
	ping -q -c 5 "$router" >/dev/null 2>&1
	if [ "$?" -ne 0 ]; then
		echo "WARN: Router $router does not answer to ICMP pings"
# Router does not answer, check arp
		routerarp=`arp -n | grep "^$router" | grep -v incomplete`
		if [ -z "$routerarp" ] ; then
			echo "ERR: We cannot retrieve a MAC address for router $router"
			status=1
		fi
	fi
	if [ "$status" -eq 0 ] ; then
		echo "INFO: The router $router is reachable"
	fi
	return $status
}

check_host () {
# Check if a host is reachable
# TODO:
# - if the host is in our local network (no route needs to be used) then
#   check ARP availability
# - if the host is not on our local network then check if we have a route
#   for it
	host=$1
	[ -z "$host" ] && return 1
# Use 10 packets as we expect this to be outside of our network
	COUNT=10
	[ -n "$2" ] && COUNT=$2
	status=0
	ping -q -c $COUNT "$host" >/dev/null 2>&1
	if [ "$?" -ne 0 ]; then
		echo "WARN: Host $host does not answer to ICMP pings"
		status=1
	else
		echo "INFO: Host $host answers to ICMP pings"
	fi
	return $status
}

check_dns () {
# Check the nameservers defined in /etc/resolv.conf
	status=1
	nsfound=0
	nsok=0
	tempfile=`mktemp tmptestnet.XXXXXX` || { echo "ERR: Cannot create temporary file! Aborting! " >&2 ; exit 1; }
	trap " [ -f \"$tempfile\" ] && /bin/rm -f -- \"$tempfile\"" 0 1 2 3 13 15
	cat /etc/resolv.conf |grep nameserver |
	awk '/nameserver/ { for (i=2;i<=NF;i++) {  print $i ; } }'  >$tempfile
	for nameserver in `cat $tempfile`;  do
		nsfound=$(( $nsfound + 1 ))
		echo "INFO: This system is configured to use nameserver $nameserver"
		check_host $nameserver 5
		if check_ns $nameserver ; then
			nsok=$(( $nsok +1 ))
		else
			status=$?
		fi
	done
	#Could also do:
	#nsfound=`wc -l $tempfile | awk '{print $1}'`
	/bin/rm -f -- "$tempfile"
	trap  0 1 2 3 13 15
	if [ "$nsfound" -eq 0 ] ; then
		echo "ERR: The system does not have any nameserver configured"
	else
		if [ "$status" -ne 0 ] ; then
			if [ "$nsfound" -eq 1 ] ; then
				echo -e "ERR: There is one nameserver configured for this system but it does not work properly"
			else
				echo "ERR: There are $nsfound nameservers configured for this system and none of them works properly"
			fi
		else
			if [ "$nsfound" -eq 1 ] ; then
				echo "INFO: The nameserver configured for this system works properly"
			else
				echo "INFO: There are $nsfound nameservers is configured for this system and $nsok are working properly"
			fi
		fi
	fi
	return $status
}

check_ns () {
# Check the nameserver using host
# TODO: use nslookup?
#	nslookup $CHECK_HOST -$nameserver
	nameserver=$1
	[ -z "$nameserver" ] && return 1
	status=1
	CHECK_RESULT="$CHECK_HOST .* $CHECK_IP_ADDRESS"
# Using dnscheck:
	dnscheck=`host -t A $CHECK_HOST $nameserver 2>&1 | tail -1`
	if [ -n "`echo $dnscheck |grep NXDOMAIN`" ] ; then
		echo "ERR: Dns server $nameserver does not resolv properly"
	elif [ -n "`echo $dnscheck | grep \"timed out\"`" ] ; then
		echo "ERR: Dns server $nameserver is not available"
	elif [ -z "`echo $dnscheck | egrep \"$CHECK_RESULT\"`" ] ; then
		echo "WARN: Dns server $nameserver did not return the expected result for $CHECK_HOST"
	else
		echo "INFO: Dns server $nameserver resolved correctly $CHECK_HOST"
		status=0
	fi

# Using dlint
#	dlint $CHECK_HOST @$nameserver >/dev/null 2>&1
#	if [ $? -eq 2 ] ; then
#		echo "ERR: Dns server $nameserver does not resolv properly"
#	elif [ $? -ne 0 ]; then
#		echo "ERR: Unexpected error when testing $nameserver"
#	else
#		echo "INFO: Dns server $nameserver resolved correctly $CHECK_HOST"
#		status=0
#	fi

	return $status
}

check_conn () {
# Checks network connectivity
	if ! check_host $CHECK_WEB_HOST >/dev/null ; then
		echo "WARN: System does not seem to reach Internet host $CHECK_WEB_HOST through ICMP"
	else
		echo "INFO: System can reach Internet host $CHECK_WEB_HOST"
	fi
# Check web access, using nc
	echo -e "HEAD / HTTP/1.0\n\n" |nc $CHECK_WEB_HOST $CHECK_WEB_PORT >/dev/null 2>&1
	if [ $? -ne 0 ] ; then
		echo "WARN: Cannot access web server at Internet host $CHECK_WEB_HOST"
	else
		echo "INFO: System can access web server at Internet host $CHECK_WEB_HOST"
	fi
}

# TODO: checks could be conditioned, i.e. if there is no proper
# interface setup don't bother with DNS and don't do some Inet checks
# if DNS is not setup properly
check_local
check_netif
check_dns
check_conn

exit 0
