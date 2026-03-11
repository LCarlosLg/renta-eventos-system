module.exports = (req,res,next)=>{

    const { categoria } = req.params

    const categoriasValidas = ["cristaleria","manteleria"]

    if(!categoriasValidas.includes(categoria)){

        return res.status(400).json({
            mensaje:"Categoría inválida"
        })

    }

    next()
}