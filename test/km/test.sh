#!/bin/bash

myname="keymaster"
othername="zuul"
gk="gk:8080"

function register {
  out=`/test/scripts/register $gk $myname`
}

function ready {
  out=`/test/scripts/ready $gk $myname`;
}

function check {
  out=`/test/scripts/ckready $gk $othername`;
  echo $out
}

function stop {
  /test/scripts/stop $gk
}

###

echo "$myname started. looking for $othername."
register

echo "$myname prepares."
sleep 15

echo "$myname meets gatekeeper."
ready

while [ "$(check)" != "ready" ]; do
   sleep 5
done

echo "$myname complete."
stop
echo
