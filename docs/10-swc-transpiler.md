## SWC Transpiler

Express Boilerplate comes with support for SWC (https://swc.rs/). 

In order to run it just uncomment lines under
```
#FOR SWC TRANSPILATION
```

in both Dockerfiles:
  - `docker/dev/Dockerfile` 
  - `docker/prod/Dockerfile` 

Then go to `docker-compose` and uncomment command to run SWC on builder service:

```
#FOR SWC TRANSPILATION
# command: [sh, -c, 'rm -rf ./build/src/* && ./node_modules/.bin/swc src --out-dir build/src -w --sync & ./node_modules/.bin/tsc -w --pretty --skipLibCheck --noEmit']
```    

Remember to comment out commands related to TSC only.

SWC build sets up the ready to go environment in about 6-7s, while TSC requires about 28s.