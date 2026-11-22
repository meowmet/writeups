#define _GNU_SOURCE
#include <string.h>
#include <stdio.h>
#include <dlfcn.h>
#include <unistd.h>
static int (*real_bcmp)(const void*,const void*,size_t)=0;
int bcmp(const void*a,const void*b,size_t n){
  if(!real_bcmp) real_bcmp=dlsym(RTLD_NEXT,"bcmp");
  if(n==72){
    char buf[256];
    int l=snprintf(buf,sizeof(buf),"CAND=%.*s|%.*s\n",(int)n,(const char*)a,(int)n,(const char*)b);
    write(2,buf,l);
  }
  return real_bcmp(a,b,n);
}
