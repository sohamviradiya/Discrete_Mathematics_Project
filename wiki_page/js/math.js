//TO DO: link two files
//define points
class point{
    constructor(x,y,prime){
        this.x=x%prime;
        this.y=y%prime;
    }
}
//operations in prime field
function sum(n1,n2,prime){
    return (prime+n1+n2)%prime;
}

function mul(n1,n2,prime){
    return (n1*n2)%prime;
}

function inv(n,prime){
    let t=1;
    for(let i=0;i<prime-2;i++){
        t=mul(t,n,prime);
    }
    return t;
}

//add two points
function add(p1,p2,prime){
    let m=mul(p1.y-p2.y,inv(p1.x-p2.x),prime);
    let x=mul(m,m,prime)-p1.x-p2.x;
    let y=mul(m,p1.x-x,prime)-p1.y;
    return new point(x,y);
}

//double a point
function double(p){
    let m=mul(3*p.x*p.x+a,inv(2*p.y),prime);
    let x=mul(m,m,prime)-2*p.x;
    let y=mul(m,p.x-x,prime)-p.y;
    return new point(x,y);
}

//multiply a point by a scalar by double and add algorithm
function mul_point(p,n){
    let bit=n.toString(2);
    let result=new point(0,0);
    for(let i=bit.length-1;i>=0;i--){
        result=double(result);
        if(bit[i]==='1'){
            result=add(result,n);
        }
    }
}

