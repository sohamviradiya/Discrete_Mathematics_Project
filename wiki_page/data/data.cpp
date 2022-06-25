#include <iostream>
#include <ctime>
#include <cstdlib>
#include<vector>
using namespace std;
class Point{
public:
    int x,y;
    int prime;
    Point(int x,int y,int prime){
        this->x = ( x > 0 ) ?(x%prime) : (prime+(x%prime))%prime;
        this->y = ( y > 0 ) ?(y%prime) : (prime+(y%prime))%prime;
        this->prime = prime;
    }
};


int inv(int n,int prime){
    int t=1;
    for(int i=0;i<prime-2;i++){
        t = (t * n) % prime;
    }
    return t;
}

//add two points
Point add(Point p1,Point p2,int prime){
    if(p1.x==0 && p1.y==0)
        return p2;
    else if(p1.x==0 && p1.y==0)
        return p1;
    else if(p1.x==p2.x)
        return Point(0,0,prime);
    int m=((p1.y-p2.y)*inv(p1.x-p2.x,prime))%prime;
    int x=m*m-p1.x-p2.x;
    int y=m*(p1.x-x)-p1.y;
    return Point(x,y,prime);
}

//double a point
Point doub(Point p,int a,int prime){
    if(p.y==0)
        return Point(0,0,prime);
    int m=((3*p.x*p.x+a)*inv(2*p.y,prime))%prime;
    int x=m*m-2*p.x;
    int y=m*(p.x-x)-p.y;
    return Point(x,y,prime);
}

//multiply a point by a scalar by double and add algorithm
Point mul(Point p,int n,int a,int prime){
    vector<int> binary;
    while(n>0){
        binary.push_back(n%2);
        n/=2;
    }
    Point result(0,0,prime);
    for(int i=binary.size()-1;i>=0;i--){
        
        result = doub(result,a,prime);
        if(binary[i]==1)
            result = add(result,p,prime);
    }
    return result;
}

int main(){
    int a,b,prime;
    cout<<"Enter a,b,prime: ";
    vector <Point> points;
    cin>>a>>b>>prime;
    // implement ece;
    int x, y;
    cout << "enter generator point: ";
    cin >> x >> y;
    Point g(x, y, prime);
    //generate secret key;
    srand(time(0));
    int alpha = rand() % prime;
    Point A = mul(g, alpha, a, prime);
    cout << A.x <<" "<< A.y << endl;
    Point B(0, 0, prime);
    cout << "Enter Point: ";
    cin >> B.x >> B.y;
    Point R = mul(B, alpha, a, prime);
    cout << "Shared secret: "<<R.x<<" "<<R.y<<endl;
}