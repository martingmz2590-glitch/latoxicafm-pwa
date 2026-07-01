const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(
    __dirname,
    "..",
    "admin",
    "data",
    "banners.json"
);

function obtenerBanners() {

    if (!fs.existsSync(DATA_PATH)) {

        return [];

    }

    const contenido = fs.readFileSync(DATA_PATH, "utf8");

    if (!contenido) {

        return [];

    }

    return JSON.parse(contenido);

}

function guardarBanners(lista) {

    fs.writeFileSync(

        DATA_PATH,

        JSON.stringify(lista, null, 4),

        "utf8"

    );

}

function crearBanner(datos, archivo) {

    const banners = obtenerBanners();

    const nuevoBanner = {

        id: Date.now(),

        titulo: datos.titulo,

        descripcion: datos.descripcion,

        enlace: datos.enlace,

        activo: datos.activo === "true",

        imagen: archivo ? archivo.filename : "",

        orden: banners.length + 1,

        fechaCreacion: new Date().toISOString(),

        fechaModificacion: new Date().toISOString()

    };

    banners.push(nuevoBanner);

    guardarBanners(banners);

    return nuevoBanner;

}

module.exports = {

    obtenerBanners,

    guardarBanners,

    crearBanner

};