import React,{useEffect,useState} from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import './board.css';
import { Button } from '@material-ui/core';
import io from 'socket.io-client';


const socket = io.connect('http://localhost:4000');
var context;


const draw=(element)=>{
  //  console.log(element);
  const Ctx=context;
   const {X1,Y1,X2,Y2,drawing}=element;
  
  // console.log(X1+" "+Y1+" "+X2+" "+Y2);

 if(drawing==="Rectangle")
{
 Ctx.strokeRect(X1,Y1,X2-X1,Y2-Y1);
 
}
else if(drawing==="Line")
{
 Ctx.beginPath(); 
 Ctx.moveTo(X1,Y1);
 Ctx.lineTo(X2,Y2);
 Ctx.stroke();
 
}
else if(drawing==="Pen")
{
   Ctx.beginPath();
   const {pointarray,drawing}=element;
   if(pointarray.length>0)
   {
   const {X1,Y1}=pointarray[0];
   Ctx.moveTo(X1,Y1);

   pointarray.map( ({X1,Y1})=>{
     //console.log(X1,Y1);
     
     Ctx.lineTo(X1,Y1);
     Ctx.stroke();
     
   });
 }
}



  return ;

 }



var emitedElements=[];   
var Coordinates=[];

socket.on('draw',(emmitedArray)=>{
 // console.log("emited array",emmitedArray);

console.log("array");
console.log(emmitedArray);
  emitedElements=emmitedArray;


  emitedElements.forEach((element)=>
  {
    context.fillStyle = 'red';
    draw(element);
  });

});



socket.on('mouse',(coordinates)=>{
 // console.log("hi");
 //context.clearRect(0,0,window.innerWidth,window.innerHeight);
 var  {X_mouse,Y_mouse}=Coordinates;
 context.fillStyle='white';
 context.fillRect(X_mouse-15,Y_mouse-80,10,10); 
 Coordinates=coordinates;  
    var  {X_mouse,Y_mouse}=Coordinates;
  context.fillStyle='black';
  context.fillRect(X_mouse-15,Y_mouse-80,10,10); 
   // console.log(coordinates);
   



});


const Board=()=> {
  
       

        


     const [test,setTest]=useState(false);

    // setTimeout( setTest(test ^ true), 2000);

     const [drawing, setdrawing]=useState("false");
     const [elements,setelements]=useState([]);
   
     const [Ctx,setContext]=useState([]);

     const [todraw,setdraw]=useState('none');
     const [preX,setpreX]=useState('0');
     const [preY,setpreY]=useState('0');
     const [linepoints,setlinepoints]=useState([]);
     const [viewonly,setviewonly]=useState(false);
     const [coordinates,setcoordinates]=useState([]);

  
    // const [isChanged,setChanged]=useState(false);

  
    async function updateUndoCanvas(){

       const canvas=document.getElementById("whiteboard");
        context=canvas.getContext('2d');
       setContext(context);
      // context.clearRect(0,0,window.innerWidth,window.innerHeight);
      
      emitedElements.forEach((element)=>
       {
         draw(element);
        
        // console.log(elements.length);
        
    //  console.log(element);
       }
      );

      elements.forEach((element)=>
      {
        draw(element);
       
       // console.log(elements.length);
       
   //  console.log(element);
      }
     );
  
    }
      
    
     
     
      
    
    const undo=()=>{
       const present_state=elements;
       if(present_state.length>0)
       {
        present_state.pop();
       }
  
       setelements(present_state);
       emmiter();    
       updateUndoCanvas();
  
      // Ctx.strokeRect('0','0','2','2');
    }
  
  
    // handle change of radio buttons
    const handleChange= (event)=>{
      setdraw(event.target.value);
     
  
    }
    // const clear=()=>{
    //   Clear();
    //   Clear();
    // }
      
  
    // clear the screen
    const Clear=( )=>{
        Ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
      
        setelements([],()=>{
           console.log("callback");          
          emmiter();
     
        });
        emmiter2();
        
    //   updateUndoCanvas();
   //    emitedElements=[];
     //  socket.emit('clear');
      }

      
    
    // handling the clicking down of mouse
    const handleMouseDown= (event)=>{
      setdrawing(true);
    //const canvas =document.getElementById('whiteboard');
    //const ctx=Canvas.getContext('2d');
     const {clientX,clientY}=event;
     if(!viewonly)
     {
     if(todraw==="Pen")
     {
     
    //  Ctx.beginPath();
    const drawing=todraw;
    const X1=clientX;
    const Y1=clientY;
    const linepoint=[{X1,Y1}];
    setlinepoints(linepoint);
    const pointarray=linepoints;
    const element={pointarray,drawing} ;
   
    
     //Ctx.moveTo(clientX,clientY);
    // Ctx.lineTo(clientX,clientY);
    // Ctx.stroke();
    setelements(prevState=>[...prevState,element]);
    emmiter();
   //socket.emit('draw',element);
     }
     else if(todraw==="Rectangle"||todraw==="Line")
     {
       setpreX(clientX);
       setpreY(clientY);
       const drawing=todraw;
       const X1=clientX;
       const Y1=clientY;
       const X2=clientX;
       const Y2=clientY;
        const element={X1,Y1,X2,Y2,drawing};
     // console.log(element);
      setelements(prevState=>[...prevState,element]);
      emmiter();
   //   socket.emit('draw',element);
      Ctx.strokeRect(clientX,clientY,0,0);
       
  
  
       
     }
    }
      return ;
  
    }
  
  
    //handling the mouse motion
    const handleMouseMove=(event)=>{
      const {clientX,clientY}=event;
      const X_mouse=clientX;
       const Y_mouse=clientY;
       setcoordinates({X_mouse,Y_mouse});
       Coordinates=coordinates;
         emmiter_mouse();

      
      if(!viewonly)
        {
      if(!drawing)
      return ;
      //const canvas =document.getElementById('whiteboard');
     // const Ctx=Canvas.getContext('2d');
     const {clientX,clientY}=event;
       
     if(todraw==="Pen") 
     {
      // Ctx.lineTo(clientX,clientY); 
      // Ctx.stroke();
      const index=elements.length-1;
     const X1=clientX;
     const Y1=clientY;
     const linepoint={X1,Y1};
     const drawing=todraw;
    setlinepoints(prevState=>[...prevState,linepoint]);
    const pointarray=linepoints;  
    const element={pointarray,drawing};
    const elementsCopy=[...elements];
    elementsCopy[index]=element;
    
    setelements(elementsCopy);
    emmiter();
  
     }
     else if(todraw==="Rectangle"||todraw==="Line")
     {
      const index=elements.length-1;
      const drawing=todraw;
      const X1=preX;
      const Y1=preY;
      const X2=clientX;
      const Y2=clientY;
      const element={X1,Y1,X2,Y2,drawing};
     //console.log(element);
      const elementsCopy=[...elements];
       elementsCopy[index]=element;
       setelements(elementsCopy);
      //  const X_mouse=X2;
      //  const Y_mouse=Y2;
      //  setcoordinates({X_mouse,Y_mouse});
    //   emmiter();
     //  Ctx.strokeRect(preX,preY,clientX,clientY);
     }
    }
  
  }
  
  
  
    //handling the mouseup 
    const handleMouseUp=(event)=>{
        if(!viewonly)
        {
      setdrawing(false); 
      //const {clientX,clientY}=event; 
      
      if(todraw==="Pen")
      {
     // const ctx=Canvas.getContext('2d');
     Ctx.stroke();
      }
      else if(todraw==="Rectangle"||todraw==="Line")
      {
        emmiter();
       // Ctx.strokeRect(preX,preY,clientX-preX,clientY-preY);
      } 
        }
      return ;
    
  
}
    // calls each time when layout changes
    
    
   function emmiter2()
   {
     socket.emit('draw',[]);
   }

  function emmiter()
    {
      socket.emit('draw',elements); 
      //console.log("emmited",elements);

    }
    function emmiter_mouse()
    {
      socket.emit('mouse',coordinates);
     // console.log("emmited",coordinates);
 
    }
    




 useEffect( ()=>{
       
     // console.log("useeffect called");   

      const canvas=document.getElementById("whiteboard");
       context=canvas.getContext('2d');
      setContext(context);
       context.clearRect(0,0,window.innerWidth,window.innerHeight);
      
     elements.forEach((element)=>
      {
        draw(element);
    
      }
     );
     
     emitedElements.forEach((element)=>
      {
        draw(element);
      }
     );
      
  
    })
      
    
    return (
         <div>
          
           {viewonly ? <div><h1><center>View only mode </center></h1></div> : <div> <h1><center>Editable mode </center></h1> </div>}
            <div className="drawing" style={{position:" fixed"}}>
            <FormControl component="fieldset">
            <FormLabel component="legend" className="tools_heading">Drawing tools</FormLabel>
            <RadioGroup aria-label="drawingtools" name="tools" value={todraw} onChange={handleChange}>
            <FormControlLabel value="Pen" control={<Radio />} label="Pen" />
            <FormControlLabel value="Rectangle" control={<Radio />} label="Rectangle" />
            <FormControlLabel value="Line" control={<Radio />} label="Line" />
          
             {/* <FormControlLabel value="Clear" control={<Radio />} label="Clear" />
           */}

        </RadioGroup>
      </FormControl>
      <Button  onClick={Clear}> Clear</Button>
     
      <Button  onClick={undo}> Undo</Button>
      {viewonly?   <Button  onClick={()=>setviewonly(false)}> Change to editable mode</Button>:<Button  onClick={()=>setviewonly(true)}> Change to view mode</Button>    }
      
       {/* <Button  onClick={save}> Save</Button>
     <Button  onClick={restore}> Restore</Button>
      */}
          
          
            </div>
  
         
         <canvas id="whiteboard" width={window.innerWidth} height={window.innerHeight} 
         onMouseDown ={handleMouseDown}
         onMouseUp ={handleMouseUp}
         onMouseMove={handleMouseMove}
        
         
         >
    Canvas 
    
     </canvas>
  
     </div>
       
  
    );
  }
  
export default Board
