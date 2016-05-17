"use strict";

const dns=require('dns');

let requests=0;

setTimeout(function callMe() {
  let times = {};
  let done=0;

  for (let i = 0; i < 20; i++) {
    (function (iter) {
      times[iter] = Date.now();
      dns.lookup('ngx.discovery', {all: 1}, function (err,ips) {
        let timestamp=Date.now();
        process.nextTick(()=>{
          requests++;
          if (timestamp-times[iter]>1000){
            console.log(`Resolving takes ${timestamp-times[iter]}ms after ${requests} requests`)
          }
          if (!ips.startsWith('10.0.')){
            console.log(`Wrong ip returned: ${ips}`)
          }

          if (!--done){
            setImmediate(callMe);
          }

        });
      });
      done++;
    })(i);
  }
});


process.on('SIGTERM', process.exit);
process.on('SIGINT', process.exit);
