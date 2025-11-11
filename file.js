let random1 = Math.floor(Math.random() * 10)
let random2 = Math.floor(Math.random() * 10)
let random3 = Math.floor(Math.random() * 10)
let random4 = Math.floor(Math.random() * 10)
let allRandoms = [random1, random2, random3, random4]
console.log(allRandoms)
let tryN = 0
let button = document.getElementById('guess-button')
button.addEventListener('click', function(e){
    e.preventDefault()
    tryN ++
    if(tryN === 4){
        button.disabled = true
        button.innerText = 'Disable'
        button.style.background = 'gray'
        alert('You end your try sorry u lose')
    }
    let input1 = document.getElementById('input1').value
    let input2 = document.getElementById('input2').value
    let input3 = document.getElementById('input3').value
    let input4 = document.getElementById('input4').value
    let res = document.getElementById('letRes')
    let allInputs = [parseInt(input1), parseInt(input2), parseInt(input3), parseInt(input4)]
    if(allInputs.some(num => isNaN(num) || num < 0 || num > 9)){
        res.innerHTML = 'enter valid number beetween 0 and 9'
        res.style.color = 'red'
        return
    }
    
    let correctP = 0
    let wrongP = 0
    let positionN = [false, false, false, false]
    for(let i = 0; i < 4; i ++){
        if(allInputs[i] === allRandoms[i]){
            correctP ++
            positionN[i] = true
        }
    }
    for(let i = 0; i < 4; i ++){
        if(allInputs[i] !== allRandoms[i]){
            for(let j = 0; j < 4; j ++){
                if(!positionN[j] && allInputs[i] === allRandoms[j]){
                    wrongP ++
                    positionN[j] = true
                    break
                }
            }
        }
    }
    if(correctP === 4){
        res.innerHTML = 'bravo'
        res.style.color = 'green'
        alert('You Win ✅')
    }else{
        res.innerText = `wrong position:${wrongP} && correct position: ${correctP}`
        res.style.color = 'orange'
    }
})