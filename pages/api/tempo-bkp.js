async function tempo(request, response) {
    function math(a, b) {
      // Usa os parâmetros a e b diretamente
      var c = a * b;
      return c;
    }
  
    var resultCalc = math(10, 5);
    const dynamicDate = new Date();
  
    response.json({
      date: dynamicDate.toGMTString(),
      calc: resultCalc.toString()
    });
  }
  
  export default tempo;
  