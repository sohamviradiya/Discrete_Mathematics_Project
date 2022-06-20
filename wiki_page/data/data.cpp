#include<iostream>
#include<vector>
using namespace std;
class Point{
public:
    int x,y;
    int prime;
    Point(int x,int y,int prime){
        this->x = x>0 ?(x%prime) : (prime+(x%prime))%prime;
        this->y =  y>0 ?(y%prime) : (prime+(y%prime))%prime;
    }
    Point(){
        this->x=0;
        this->y=0;
        this->prime=2;
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
    int m=(p1.y-p2.y)*inv(p1.x-p2.x,prime);
    int x=m*m-p1.x-p2.x;
    int y=m*(p1.x-x)-p1.y;
    Point p(x,y,prime);
    return p;
}

//double a point
Point doub(Point p,int a,int prime){
    int m=(3*p.x*p.x+a)*inv(2*p.y,prime);
    int x=m*m-2*p.x;
    int y=m*(p.x-x)-p.y;
    Point p(x,y,prime);
    return p;
}

//multiply a point by a scalar by double and add algorithm
Point mul_point(Point p,int n,int a,int prime){
    //convert n to binary
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
}

int main(){
    int a,b,prime;
    cout<<"Enter a,b,prime: ";
    vector <Point> points;
    cin>>a>>b>>prime;
    //print all subgroups of points
    for(int i=0;i<prime;i++){
        
    }


    //print all points
    for(int i=0;i<points.size();i++){
        cout<<points[i].x<<" "<<points[i].y<<endl;
    }
}