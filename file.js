document.getElementById('guess-button').document.addEventListener('click', function(e){
    e.preventDefault();
    let input1 = parseInt(document.getElementById('input1').value)
    let input2 = parseInt(document.getElementById('input2').value)
    let input3 = parseInt(document.getElementById('input3').value)
    let input4 = parseInt(document.getElementById('input4').value)
    let allInput = [input1, input2, input3, input4]
    let resultat = document.getElementById('letRes')
    let randomN1 = Math.floor(Math.random() * 10)
    let randomN2 = Math.floor(Math.random() * 10)
    let randomN3 = Math.floor(Math.random() * 10)
    let randomN4 = Math.floor(Math.random() * 10)
    let allRandom = [randomN1, randomN2, randomN3, randomN4]
    if (allInput.some(num=> num = isNaN || num < 0 || num > 9)){
        resultat.innerHTML = 'please enter a valid number between 0 and 9'
        resultat.style.color = 'red'
        return
    }
    let correctP = 0
    let wrongP = 0
    let positionN = [false, false, false, false]
    for (let i = 0; i < 4; i++) {
        if(allInput[i] === allRandom[i]){
            correctP ++
            positionN[i] = true
        }
    }
    for(let i = 0; i < 4; i++){
        if(allInput[i] !== allRandom[i]){
            for(let j = 0; j < 4; j++){
                if(!positionN[j] && allInput[i] === allRandom[i]){
                    wrongP ++
                    positionN[j] = true
                    break
                }
            }
        }
    }
    let resultText = `${correctP} correct position(s), ${wrongP} wrong position(s).`
    if(correctP === 4){
        resultat.innerHTML = 'bravo'
        resultat.style.color = 'green'
    }else{
            resultat.innerHTML = resultText
        resultat.style.color = 'orange'
    }
    
})
