//begin
        //prime number
        let prime_radio=document.querySelectorAll('.prime-radio');
        let prime= 17;
        let prime_array = [13, 31, 61] ;
        prime_radio.forEach(function(radio){
            radio.addEventListener('click',() =>{
                prime = prime_array[Number(radio.value)];
                console.log(`selected prime: ${prime}`);
            });
        });

//math
//define points
    class point{
        constructor(x,y){
            this.x = x>0 ?(x%prime) : (prime+(x%prime))%prime;
            this.y =  y>0 ?(y%prime) : (prime+(y%prime))%prime;
        }
    }

    function inv(n){
        let t=1;
        for(let i=0;i<prime-2;i++){
            t=(t*n)%prime;
        }
        return t;
    }

    //add two points
    function add(p1, p2) {
        if(p1.x===0 && p1.y===0)
            return p2;
        else if(p2.x===0 && p2.y===0)
            return p1;
        else if(p1.x===p2.x)
            return new point(0,0);
        let m=((p1.y-p2.y)*inv(p1.x-p2.x))%prime;   //possible bound error
        let x=m*m-p1.x-p2.x;
        let y=m*(p1.x-x)-p1.y;
        return new point(x,y);
    }

    //double a point
    function mulx2(p) {
        if(p.y===0)
            return new point(0,0);
        let m=((3*p.x*p.x+a)*inv(2*p.y))%prime;   //possible bound error
        let x=m*m-2*p.x;
        let y=m*(p.x-x)-p.y;
        return new point(x,y);
    }

    //multiply a point by a scalar by double and add algorithm
    function mul_point(p,n){
        let bit=n.toString(2);
        let result=new point(0,0);
        for(let i=bit.length-1;i>=0;i--){
            let temp = mulx2(result);
            result.x = temp.x;
            result.y = temp.y;
            if(bit[i]=='1'){
                result=add(result,p);
            }
        }
        return result;
    }

//DOM
    const root=document.querySelector(':root');

    //curve
    let curve_radio=document.querySelectorAll('.equation-radio');
    let a = 1;
    let b = 2;
    let curve_array = [[1,6], [2,4], [-2,5]];
    let g_point_array = [[2,4],[2,4],[1,2]];
    let g_point = new point(0,0);
    curve_radio.forEach(function(radio){
        radio.addEventListener('click',() =>{
            a = curve_array[Number(radio.value)][0];
            b = curve_array[Number(radio.value)][1];
            console.log(` selected (a,b) pair: (${a}, ${b})`);
            g_point= new point(g_point_array[Number(radio.value)][0],g_point_array[Number(radio.value)][1]);
            console.log(` selected g point: (${g_point.x}, ${g_point.y})`);
        });
    });

    const canvas = document.querySelector('#input-graph');
    //empty canvas
    function empty_canvas(){
        while (canvas.firstChild) {
            while(canvas.firstChild.firstChild){
                canvas.firstChild.removeChild(canvas.firstChild.firstChild);
            }
            canvas.removeChild(canvas.firstChild);
        }
    }

    function generate_curve(a,b,p){
        empty_canvas();
        for(let y=p-1;y>=0;y--)
        {
            const row = document.createElement('div');
            row.classList.add('row');
            row.setAttribute('id',`row${y}`);
            row.style.height= 80/p+"vh";
            row.style.display="flex";
            row.style.flexDirection="row";
            for(let x=0;x<p;x++)
            {
                const cell=document.createElement('div');
                cell.classList.add('cell');
                cell.style.width = row.style.height;
                cell.style.height = row.style.height;
                cell.style.backgroundColor = ( (y**2-x**3-a*x-b)%p === 0 )? '#0000FF': '#FFFFFF';
                cell.style.border="1px solid black";
                row.appendChild(cell);
            }
            canvas.appendChild(row);
        }
    }

    const encryter = document.getElementById('encrypter');
    const bob_curve = document.getElementById('bob-curve');
    const alice_curve = document.getElementById('alice-curve');
    const bob_prime = document.getElementById('bob-prime');
    const alice_prime = document.getElementById('alice-prime');
    const bob_input_x = document.getElementById('bob-input-x');
    const bob_input_y = document.getElementById('bob-input-y');
    const alice_input_x = document.getElementById('alice-input-x');
    const alice_input_y = document.getElementById('alice-input-y');

    function set_curve(a,b,prime){
            bob_prime.innerText = `Prime: ${prime}`;
            bob_curve.innerHTML =   ` y<sup>2</sup> &equiv; x<sup>3</sup> + ${a}x + ${b} (mod ${prime})`;
            alice_prime.innerText = `Prime: ${prime}`;
            alice_curve.innerHTML = ` y<sup>2</sup>  &equiv; x<sup>3</sup> + ${a}x + ${b} (mod ${prime})`;
            bob_input_x.setAttribute('max',`${(prime)-1}`);
            bob_input_y.setAttribute('max',`${(prime)-1}`);
            alice_input_x.setAttribute('max',`${(prime)-1}`);
            alice_input_y.setAttribute('max',`${(prime)-1}`);
        }

    //generate curve
   const generator_button = document.querySelector('#graph-generator');
     generator_button.addEventListener('click',() =>{
         set_curve(a,b,prime);
         generate_curve(a,b,prime);
         encryter.style.opacity='1';
    });

    let bob_input_point = new point(0,0);
    let alice_input_point = new point(0,0);

    const bob_x_label = document.getElementById('bob-x-label');
    const bob_y_label = document.getElementById('bob-y-label');
    const alice_x_label = document.getElementById('alice-x-label');
    const alice_y_label = document.getElementById('alice-y-label');
    const bob_point_output = document.getElementById('bob-point');
    const alice_point_output = document.getElementById('alice-point');

    bob_input_x.oninput = () => {
        bob_input_point.x = Number(bob_input_x.value);
        bob_x_label.innerText = `x: ${bob_input_point.x}`;
    }

    bob_input_y.oninput = () => {
        bob_input_point.y = Number(bob_input_y.value);
        bob_y_label.innerText = `y: ${bob_input_point.y}`;
    }

    alice_input_x.oninput = () => {
        alice_input_point.x = Number(alice_input_x.value);
        alice_x_label.innerText = `x: ${alice_input_point.x}`;
    }

    alice_input_y.oninput = () => {
        alice_input_point.y = Number(alice_input_y.value);
        alice_y_label.innerText = `y: ${alice_input_point.y}`;
    }

    const generate_bob_point = document.getElementById('bob-generate-point');
    const generate_alice_point = document.getElementById('alice-generate-point');
    let alice_private_key = 1;
    let bob_private_key = 1;
    let alice_output_point = new point(0,0);
    let bob_output_point = new point(0,0);

    generate_bob_point.onclick = () => {
        set_curve(a,b,prime);
        generate_curve(a,b,prime);
        bob_private_key = Number(new Date())%prime;
        if(bob_private_key === 0)
            bob_private_key = 1;
        bob_output_point = mul_point(g_point,bob_private_key);
        bob_point_output.innerText = `B: (${bob_output_point.x}, ${bob_output_point.y})`;
    }

    generate_alice_point.onclick = () => {
        set_curve(a,b,prime);
        generate_curve(a,b,prime);
        alice_private_key = Number(new Date)%prime;
        alice_output_point = mul_point(g_point,alice_private_key);
        alice_point_output.innerText = `A: (${alice_output_point.x}, ${alice_output_point.y})`;
    }

    const bob_secret_generator = document.getElementById('bob-secret-generator');
    const alice_secret_generator = document.getElementById('alice-secret-generator');
    const bob_common_secret = document.getElementById('bob-secret');
    const alice_common_secret = document.getElementById('alice-secret');

    bob_secret_generator.onclick = () => {
        if(bob_output_point.x === 0 && bob_output_point.y===0){
            alert('B cannot be point at infinity');
        }
        else if((Math.pow((bob_input_point.y),2) - Math.pow((bob_input_point.x),3) - a*(bob_input_point.x) - b)%prime !== 0){
            console.log(bob_input_point);
            console.log((Math.pow((bob_input_point.y),2) - Math.pow((bob_input_point.x),3) - a*(bob_input_point.x) - b));
            alert('Left Input point is not on the curve');
        }
        else {
            let temp = new point(bob_input_point.x, bob_input_point.y);
            let bob_secret = mul_point(g_point, (bob_private_key*alice_private_key)%prime);
            bob_common_secret.innerText = `Common secret: (${bob_secret.x}, ${bob_secret.y})`;
        }
    }

    alice_secret_generator.onclick = () => {

        if(alice_output_point.x === 0 && alice_output_point.y===0){
            alert('B cannot be point at infinity');
        }
        else if((Math.pow((alice_input_point.y),2)-Math.pow((alice_input_point.x),3) - a*(alice_input_point.x) - b)%prime !== 0){
            console.log(alice_input_point)
            console.log((Math.pow((alice_input_point.y),2)-Math.pow((alice_input_point.x),3) - a*(alice_input_point.x) - b));
            alert('Right Input point is not on the curve');
        }
        else {
            let temp = new point(alice_input_point.x, alice_input_point.y);

            let alice_secret = mul_point(g_point, (bob_private_key*alice_private_key)%prime);
            alice_common_secret.innerText = `Common secret: (${alice_secret.x}, ${alice_secret.y})`;
        }
    }
    //end
