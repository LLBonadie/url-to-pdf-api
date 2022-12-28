function tempo(request, resposnse){

    function math(a, b){
        return a + b
    };

    cont = resultCalc(10, 5)

    const dynamicDate = new Date();
    resposnse.json({
        date: dynamicDate.toGMTString(),
        calc: resultCalc
    })

}

export default tempo;