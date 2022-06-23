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
    let pointarr = [[4, 6], [1, 2], [10, 3], [16, 0], [10, 14], [1, 15], [4, 11], [0, 0]];
    let curve_array = [[1,6], [2,4], [-2,5]];
    let g_point_array = [[2,4],[2,4],[1,2]];
    let g_point = new point(0,0);
    curve_radio.forEach(function(radio){
        radio.addEventListener('click',() =>{
            a = curve_array[Number(radio.value)][0];
            b = curve_array[Number(radio.value)][1];
            console.log(` selected (a,b) pair: (${a}, ${b})`);
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

    const encrypter = document.getElementById('encrypter');
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
            alice_input_y.setAttribute('max', `${(prime) - 1}`);

        if (a === 1 && b === 6) {
            if (prime === 13) {
                pointarr = [[2, 4], [9, 9], [11, 10], [12, 11], [3, 7], [4, 3], [4, 10], [3, 6], [12, 2], [11, 3], [9, 4], [2, 9], [0, 0]];
                console.log(`cofactor: 1`);
            }
            else if (prime === 31) {
                pointarr = [[2, 4], [3, 6], [30, 2], [27, 0], [30, 29], [3, 25], [2, 27], [0, 0]];
                console.log(`cofactor: 4`);
            }
            else if (prime === 61) {
                pointarr = [[2, 4], [32, 54], [23, 22], [33, 13], [45, 15], [30, 47], [54, 12], [57, 11], [22, 60], [18, 0], [22, 1], [57, 50], [54, 49], [30, 14], [45, 46], [33, 48], [23, 39], [32, 7], [2, 57], [0, 0]];
                console.log(`cofactor: 3`);
            }
        }
        else if (a === 2 && b === 4) {
            if (prime === 13) {
                pointarr = [[2, 4], [8, 5], [7, 6], [0, 2], [12, 12], [9, 6], [5, 10], [10, 6], [10, 7], [5, 3], [9, 7], [12, 1], [0, 0]];
                console.log(`cofactor: 1.3`);
            }
            else if (prime === 31) {
                pointarr = [[2, 4], [1, 21], [7, 19], [0, 2], [30, 30], [19, 9], [28, 23], [8, 25], [10, 30], [16, 28], [21, 21], [24, 22], [9, 10], [22, 1], [4, 18], [12, 19], [27, 5], [27, 26], [12, 12], [4, 13], [22, 30], [9, 21], [24, 9], [21, 10], [16, 3], [10, 1], [8, 6], [28, 8], [19, 22], [30, 1], [0, 0]];
                console.log(`cofactor: 1.1`);
            }
            else if (prime === 61) {
                pointarr = [[2, 4], [41, 4], [18, 57], [26, 8], [11, 25], [6, 7], [4, 25], [28, 28], [12, 29], [38, 28], [35, 35], [46, 36], [10, 29], [54, 47], [9, 43], [30, 23], [16, 17], [56, 33], [60, 1], [0, 59], [7, 42], [39, 32], [40, 20], [55, 9], [53, 5], [42, 0], [53, 56], [55, 52], [40, 41], [39, 29], [7, 19], [0, 2], [60, 60], [56, 28], [16, 44], [30, 38], [9, 18], [54, 14], [10, 32], [46, 25], [35, 26], [38, 33], [12, 32], [28, 33], [4, 36], [6, 54], [11, 36], [26, 53], [18, 4], [41, 57], [2, 57], [0, 0]];
                console.log(`cofactor: 1`);
            }
        }
        else if (a === -2 && b === 5) {
            if (prime === 13) {
                pointarr = [[1, 2], [7, 3], [9, 1], [2, 3], [11, 1], [4, 10], [5, 9], [6, 12], [10, 6], [3, 0], [10, 7], [6, 1], [0, 0]];
                console.log(`cofactor: 1.5`);
            }
            else if (prime === 31) {
                pointarr = [[1, 2], [0, 6], [15, 23], [25, 24], [25, 7], [15, 8], [0, 25], [1, 29], [0, 0]];
                console.log(`cofactor: 3`);
            }
            else if (prime === 61) {
                pointarr = [[1, 2], [40, 34], [8, 47], [51, 60], [0, 26], [26, 49], [43, 2], [17, 59], [24, 19], [49, 58], [31, 24], [13, 38], [56, 16], [23, 29], [53, 34], [46, 36], [29, 27], [9, 17], [4, 0], [9, 44], [29, 34], [46, 25], [53, 27], [23, 32], [56, 45], [13, 23], [31, 37], [49, 3], [24, 42], [17, 2], [43, 59], [26, 12], [0, 35], [51, 1], [8, 14], [40, 27], [1, 59], [0, 0]];
                console.log(`cofactor: 2`);
            }
        }
        }
    let g_index=1;
    //generate curve
   const generator_button = document.querySelector('#graph-generator');
     generator_button.addEventListener('click',() =>{
         set_curve(a,b,prime);
         generate_curve(a, b, prime);
         g_point= new point(0,0);
         g_index= Date.now()%pointarr.length;
         g_point.x=pointarr[g_index-1][0];
         g_point.y=pointarr[g_index-1][1];
         console.log(`g_point: ${g_point.x}, ${g_point.y}`);
         encrypter.style.opacity='1';
    });

    let bob_input_point = new point(0,0);
    let alice_input_point = new point(0,0);

    const bob_x_label = document.getElementById('bob-x-label');
    const bob_y_label = document.getElementById('bob-y-label');
    const alice_x_label = document.getElementById('alice-x-label');
    const alice_y_label = document.getElementById('alice-y-label');
    const bob_point_output = document.getElementById('bob-point');
    const alice_point_output = document.getElementById('alice-point');
    const generate_bob_point = document.getElementById('bob-generate-point');
    const generate_alice_point = document.getElementById('alice-generate-point');
    const bob_secret_generator = document.getElementById('bob-secret-generator');
    const alice_secret_generator = document.getElementById('alice-secret-generator');
    const bob_common_secret = document.getElementById('bob-secret');
    const alice_common_secret = document.getElementById('alice-secret');
    let bob_private_key = 1;
    let alice_private_key = 1;
    let bob_output_point = new point(0,0);
    let alice_output_point = new point(0,0);
    let bob_output = 1;
    let alice_output = 1;
    let bob_input=1;
    let alice_input=1;

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

    generate_bob_point.onclick = () => {
        bob_private_key = (Date.now())%prime;
        bob_output = g_index*bob_private_key;
        bob_output_point.x = pointarr[(bob_output-1)%pointarr.length][0];
        bob_output_point.y = pointarr[(bob_output-1)%pointarr.length][1];
        bob_point_output.innerText = `B: (${bob_output_point.x}, ${bob_output_point.y})`;
    }

    generate_alice_point.onclick = () => {
        alice_private_key = (Date.now())%prime;
        alice_output = g_index*alice_private_key;
        alice_output_point.x = pointarr[(alice_output-1)%pointarr.length][0];
        alice_output_point.y = pointarr[(alice_output-1)%pointarr.length][1];
        alice_point_output.innerText = `A: (${alice_output_point.x}, ${alice_output_point.y})`;
    }

    bob_secret_generator.onclick = () => {
        if(bob_output_point.x === 0 && bob_output_point.y===0){
            alert('B cannot be point at infinity');
        }
        else if(pointarr.includes([bob_input_point.x, bob_input_point.y])){
            bob_input= 1+pointarr.indexOf([bob_input_point.x,bob_input_point.y]);
            let bob_secret = new point(0,0);
            bob_secret.x = pointarr[(bob_input*bob_private_key-1)%pointarr.length][0];
            bob_secret.y = pointarr[(bob_input*bob_private_key-1)%pointarr.length][1];
            bob_common_secret.innerText = `R: (${bob_secret.x}, ${bob_secret.y})`;
        }
        else {
            console.log(bob_input_point);
            console.log(pointarr);
            alert('Invalid point');
        }
    }

    alice_secret_generator.onclick = () => {
        if(alice_output_point.x === 0 && alice_output_point.y===0){
            alert('A cannot be point at infinity');
        }
        else if(pointarr.includes([alice_input_point.x, alice_input_point.y])){
            alice_input= 1+pointarr.indexOf([alice_input_point.x,alice_input_point.y]);
            let alice_secret = new point(0,0);
            alice_secret.x = pointarr[(alice_input*alice_private_key-1)%pointarr.length][0];
            alice_secret.y = pointarr[(alice_input*alice_private_key-1)%pointarr.length][1];
            alice_common_secret.innerText = `R: (${alice_secret.x}, ${alice_secret.y})`;
        }
        else {
            console.log(alice_input_point);
            console.log(pointarr);
            alert('Invalid point');
        }
    }
    //end
