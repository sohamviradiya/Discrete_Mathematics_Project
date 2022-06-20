#include<iostream>
#include<vector>
using namespace std;
class Point{
public:
    int x,y;
    int prime;
    Point(int x,int y,int prime){
        this->x=(prime+x)%prime;
        this->y=(prime+y)%prime;
    }
    Point(){
        this->x=0;
        this->y=0;
    }
};

int main(){
    int a,b,prime;
    cout<<"Enter a,b,prime: ";
    vector <Point> points;
    cin>>a>>b>>prime;
    for(int y=prime-1;y>=0;y--){
        for(int x=0;x<prime;x++){
            if( (y*y-x*x*x-a*x-b)%prime == 0){
                points.push_back(Point(x,y,prime));
            }
        }
    }
    //print all points
    for(int i=0;i<points.size();i++){
        cout<<points[i].x<<" "<<points[i].y<<endl;
    }
}