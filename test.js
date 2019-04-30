let array1 = require('./dataArr.js');
let fs = require('fs');
// console.log(array1)

// let array = filterArray('fail');

// let data = {
//   failed: filterArray('fail'),
//   passed: filterArray('pass')
// }

// writeFile(data)

let a = array1.map (e => {
  return {
    rollno: e.RollNo,
    reg : e.RegdNo
  }
})

console.log(a)

function filterArray(e){
  e === 'pass'?e = true: null;
  e === 'fail'?e = false: null;
  
  let array = [];
  array1
    .forEach((el,i,arr) => {
      if(el && (null||el.Name) && el.pass === e)
        !array.find(e=>el.RollNo === e.RollNo)?array.push(el):null;
    })
  
  array = array.map(e => {
      return {
        Total: e.result.reduce((a,c)=>a+c.total,0),
        ...e,
      };
    });
  array.sort((a,b) => -a.Total+b.Total); 
  return array;
}

// array1 = array1.filter((e,i,arr) => {
//   return null||e.Name && !e.pass ;
// });

// let array = []
// array1 = array1.filter(el => {
//   !array.find(e=>el.RollNo === e.RollNo)?array.push(el):null;
// })

// array = array.map(e => {
//   return {
//     Total: e.result.reduce((a,c)=>a+c.total,0),
//     ...e,
//   };
// });

// array.sort((a,b) => -a.Total+b.Total);


function print(array){
    array.forEach((e,i) => {
      console.log((i+1+'.').padEnd(4,' ')
      ,e.Name.padEnd(25,' '),
      'Total: '+e.Total, `\tpercentage: ${(e.Total/600*100).toFixed(2)}     Roll No.: ${e.RollNo}`);
    });
  }

// failed students


// array.forEach((e,i) => {
//   console.log((i+1+'.').padEnd(4,' ')
//   ,e.Name.padEnd(25,' '),
//   'Total: '+e.Total, `\tpercentage: ${(e.Total/600*100).toFixed(2)}     Roll No.: ${e.RollNo}`);
//   // console.log((i+1+'.,')
//   // ,e.Name + ',',
//   // 'Total: '+e.Total, `,percentage: ${(e.Total/600*100).toFixed(2)},Roll No.: ${e.RollNo}`)
// });
function total(a,c){
  let int = c.internal?c.internal:0;
  let ext = c.external?c.external:0;
  if(c.subject == 'Drug Abuse:Problem Mgt.& Prevention (Not Qualified)' || c.subject == 'Drug Abuse:Problem Mgt.& Prevention (Qualified)'){
    int = 0;
    ext = 0;
  }
  return a+(int+ext)
}


class studentSubjectData{
  constructor(el, e){
    this.RollNo = e.RollNo;
    this.Name = e.Name;
    this.Total = el.total;
  }
}

function subjectResult(array){
  let result = {};
  array.forEach(e => {
    e.result.forEach(el => {
        if(result[el.subject]){
          result[el.subject].push(new studentSubjectData(el, e))
        }else{
          result[el.subject] = [];
          result[el.subject].push(new studentSubjectData(el, e))
        }
      })
  })
  return result;
}


function writeFile(dataArr){
    let string = "let dataArr = " + JSON.stringify(dataArr) +"; module.exports = dataArr;" 
        fs.writeFile('./dataArr.js', string, function(err){
          if(err) throw err;
        })
}


// console.log(subjectResult(array1.passed))
// print(array1.failed)
//console.log(array1)

// print(filterArray("fail"));



// console.log(array1.find(el=>+el.RollNo === 10013))
