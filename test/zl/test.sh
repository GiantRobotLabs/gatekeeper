#!/bin/bash

myname="zuul"
othername="keymaster"
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

echo "$myname started. waiting for $othername."
register

while [ "$(check)" != "ready" ]; do
   sleep 5
done

echo "$myname proceeds."
ready
