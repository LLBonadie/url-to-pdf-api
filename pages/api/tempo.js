function tempo(request, resposnse){

    const dynamicDate = new Date();
    resposnse.json({
        date: dynamicDate.toGMTString()
    })

}

export default tempo;