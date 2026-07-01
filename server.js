const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = 3000;

console.log("=================================");
console.log("SERVER CARGADO:");
console.log(__filename);
console.log("=================================");

//======================================================
// RUTAS
//======================================================

const ADMIN_DIR = path.join(__dirname, "admin");

console.log("ADMIN_DIR:");
console.log(ADMIN_DIR);

console.log(
    "Existe admin/js/top.js:",
    fs.existsSync(path.join(ADMIN_DIR, "js", "top.js"))
);

const DATA_DIR = path.join(ADMIN_DIR, "data");

const UPLOADS_DIR = path.join(ADMIN_DIR, "uploads", "banners");

// Base de datos de Banners
const BANNERS_FILE = path.join(DATA_DIR, "banners.json");

// Base de datos del Top Semanal
const TOP_FILE = path.join(DATA_DIR, "top.json");

//======================================================
// CREAR CARPETAS
//======================================================

if (!fs.existsSync(BANNERS_FILE)) {
    fs.writeFileSync(BANNERS_FILE, "[]", "utf8");
}

if (!fs.existsSync(TOP_FILE)) {
    fs.writeFileSync(TOP_FILE, "[]", "utf8");
}




//======================================================
// MIDDLEWARE
//======================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {

    console.log(
        "[" + new Date().toLocaleTimeString() + "]",
        req.method,
        req.url
    );

    next();

});

//======================================================
// DIAGNÓSTICO
//======================================================

console.log("ADMIN_DIR:");
console.log(ADMIN_DIR);

console.log("");

console.log("UPLOADS_DIR:");
console.log(UPLOADS_DIR);

console.log("");

console.log(
    "Existe carpeta uploads:",
    fs.existsSync(UPLOADS_DIR)
);

if (fs.existsSync(UPLOADS_DIR)) {

    console.log("");

    console.log("Contenido de uploads:");

    console.log(
        fs.readdirSync(UPLOADS_DIR)
    );

}

console.log("");

//======================================================
// ARCHIVOS ESTÁTICOS
//======================================================

app.use("/admin", express.static(ADMIN_DIR));

app.use(
    "/uploads",
    express.static(UPLOADS_DIR)
);

//======================================================
// MULTER
//======================================================





















const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, UPLOADS_DIR);

    },

    filename(req, file, cb) {

        cb(
            null,
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "_")
        );

    }

});

const upload = multer({
    storage
});

//======================================================
// FUNCIONES
//======================================================

function leerBanners() {

    try {

        const txt = fs.readFileSync(
            BANNERS_FILE,
            "utf8"
        );

        if (!txt.trim()) {

            return [];

        }

        return JSON.parse(txt);

    }

    catch {

        return [];

    }

}

function guardarBanners(lista) {

    fs.writeFileSync(
        BANNERS_FILE,
        JSON.stringify(lista, null, 4),
        "utf8"
    );

}






//======================================================
// TOP SEMANAL
//======================================================

function leerTop() {

    try {

        const txt = fs.readFileSync(
            TOP_FILE,
            "utf8"
        );

        if (!txt.trim()) {

            return [];

        }

        return JSON.parse(txt);

    }

    catch {

        return [];

    }

}

function guardarTop(lista) {

    fs.writeFileSync(

        TOP_FILE,

        JSON.stringify(lista, null, 4),

        "utf8"

    );

}



















//======================================================
// HOME
//======================================================

app.get("/", (req, res) => {

    res.json({

        ok: true,

        mensaje: "Servidor funcionando correctamente"

    });

});

//======================================================
// LISTAR
//======================================================

app.get("/api/banners", (req, res) => {

    const banners = leerBanners();

    res.json({

        ok: true,

        total: banners.length,

        banners

    });

});










//======================================================
// LISTAR TOP SEMANAL
//======================================================

app.get("/api/top", (req, res) => {

    const canciones = leerTop();

    res.json({

        ok: true,

        total: canciones.length,

        canciones

    });

});
















//======================================================
// OBTENER UNO
//======================================================

app.get("/api/banners/:id", (req, res) => {

    const banners = leerBanners();

    const id = Number(req.params.id);

    const banner = banners.find(b => b.id === id);

    if (!banner) {

        return res.status(404).json({

            ok: false,

            mensaje: "Banner no encontrado"

        });

    }

    res.json({

        ok: true,

        banner

    });

});



app.post(

    "/api/banners",

    upload.fields([
        { name: "imagen", maxCount: 1 },
        { name: "imagenMobile", maxCount: 1 }
    ]),

    (req, res) => {

        try {

            const banners = leerBanners();

            const nuevo = {

                id: Date.now(),

                titulo: req.body.titulo || "",

                descripcion: req.body.descripcion || "",

                enlace: req.body.enlace || "",

                activo: req.body.activo === "true",

                imagen:
                    req.files?.imagen
                        ? req.files.imagen[0].filename
                        : "",

                imagenMobile:
                    req.files?.imagenMobile
                        ? req.files.imagenMobile[0].filename
                        : "",

                orden: banners.length + 1

            };

            banners.push(nuevo);

            guardarBanners(banners);

            res.json({

                ok: true,

                mensaje: "Banner creado.",

                banner: nuevo

            });

        }

        catch (err) {

            console.error(err);

            res.status(500).json({

                ok: false,

                error: err.message

            });

        }

    }

);


//======================================================
// EDITAR
//======================================================

app.put(

    "/api/banners/:id",

    upload.fields([
        { name: "imagen", maxCount: 1 },
        { name: "imagenMobile", maxCount: 1 }
    ]),

    (req, res) => {

        try {

            const id = Number(req.params.id);

            const banners = leerBanners();

            const index = banners.findIndex(
                b => b.id === id
            );

            if (index === -1) {

                return res.status(404).json({
                    ok: false,
                    mensaje: "Banner no encontrado"
                });

            }

            const banner = banners[index];

            //====================================
            // IMAGEN ESCRITORIO
            //====================================

            if (req.files?.imagen) {

                if (banner.imagen) {

                    const vieja = path.join(
                        UPLOADS_DIR,
                        banner.imagen
                    );

                    if (fs.existsSync(vieja)) {

                        fs.unlinkSync(vieja);

                    }

                }

                banner.imagen = req.files.imagen[0].filename;

            }

            //====================================
            // IMAGEN MÓVIL
            //====================================

            if (req.files?.imagenMobile) {

                if (banner.imagenMobile) {

                    const vieja = path.join(
                        UPLOADS_DIR,
                        banner.imagenMobile
                    );

                    if (fs.existsSync(vieja)) {

                        fs.unlinkSync(vieja);

                    }

                }

                banner.imagenMobile =
                    req.files.imagenMobile[0].filename;

            }

            banner.titulo = req.body.titulo || "";
            banner.descripcion = req.body.descripcion || "";
            banner.enlace = req.body.enlace || "";
            banner.activo = req.body.activo === "true";

            banners[index] = banner;

            guardarBanners(banners);

            res.json({

                ok: true,
                mensaje: "Banner actualizado.",
                banner

            });

        }

        catch (err) {

            console.error(err);

            res.status(500).json({

                ok: false,
                error: err.message

            });

        }

    }

);





//======================================================
// AGREGAR CANCIÓN
//======================================================

app.post("/api/top", (req, res) => {

    console.log("");
    console.log("=================================");
    console.log("🔥 POST /api/top");
    console.log("Body recibido:");
    console.log(req.body);
    console.log("=================================");

    try {

        const canciones = leerTop();

        const nueva = {

            id: Date.now(),

            posicion: Number(req.body.posicion),

            titulo: req.body.titulo || "",

            artista: req.body.artista || "",

            youtube: req.body.youtube || "",

            activo:
                req.body.activo === true ||
                req.body.activo === "true"

        };

        canciones.push(nueva);

        guardarTop(canciones);

        console.log("✅ Canción guardada correctamente.");
        console.log(nueva);

        res.json({

            ok: true,

            mensaje: "Canción guardada correctamente.",

            cancion: nueva

        });

    }

    catch (err) {

        console.error("❌ Error al guardar canción:");
        console.error(err);

        res.status(500).json({

            ok: false,

            error: err.message

        });

    }

});
















//======================================================
// ELIMINAR BANNER
//======================================================

app.delete("/api/banners/:id", (req, res) => {

    try {

        console.log("");
        console.log("=================================");
        console.log("DELETE /api/banners/:id");
        console.log("ID recibido:", req.params.id);
        console.log("=================================");

        const id = Number(req.params.id);

        const banners = leerBanners();

        const index = banners.findIndex(
            banner => banner.id === id
        );

        if (index === -1) {

            return res.status(404).json({

                ok: false,

                mensaje: "Banner no encontrado"

            });

        }

        const banner = banners[index];

        // Eliminar imagen del disco

        if (banner.imagen) {

            const archivo = path.join(
                UPLOADS_DIR,
                banner.imagen
            );

            if (fs.existsSync(archivo)) {

                fs.unlinkSync(archivo);

            }

        }

        // Eliminar registro

        banners.splice(index, 1);

        guardarBanners(banners);

        console.log("Banner eliminado:", id);

        res.json({

            ok: true,

            mensaje: "Banner eliminado correctamente."

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            ok: false,

            error: err.message

        });

    }

});




















//======================================================
// 404
//======================================================

app.use((req, res) => {

    res.status(404).json({

        ok: false,

        mensaje: "Ruta no encontrada",

        ruta: req.originalUrl

    });

});

//======================================================
// INICIAR
//======================================================



app.get("/prueba-delete", (req, res) => {

    res.json({

        ok: true,

        mensaje: "Prueba correcta"

    });

});






app.listen(PORT, () => {

    console.log("");

    console.log("=================================");

    console.log("SERVIDOR INICIADO");

    console.log("http://localhost:" + PORT);

    console.log("=================================");

    console.log("");

});