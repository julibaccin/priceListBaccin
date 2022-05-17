interface IProduct {
	linea: string;
	empresa: string;
	categoria: string;
	producto: string;
	precio: number;
	stock: number;
	fecha_precio: Date;
}

import { Router } from "express";
import Excel from "exceljs";
import multer from "multer";
import path from "path";
const router = Router();

let cache: IProduct[] = [];
let newData = true;

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "..", "upload"));
	},
	filename: function (req, file, cb) {
		cb(null, "products.xlsx");
	},
});

const multerMiddle = multer({ storage: storage }).single("excel");

router.get("/products", async (req, res) => {
	if (!newData && cache) return res.status(200).json({ data: cache });
	try {
		const workbook = new Excel.Workbook();
		const FILE = await workbook.xlsx.readFile(path.join(__dirname, "..", "upload", "products.xlsx"));
		const PAGE = FILE.worksheets[0];
		const data: IProduct[] = [];

		PAGE.eachRow(({ values }: any, rowNumber) => {
			if (rowNumber == 1) return;
			data.push({
				linea: values[1],
				empresa: values[2],
				categoria: values[3],
				producto: values[4],
				precio: values[5],
				stock: values[6],
				fecha_precio: values[7],
			});
		});
		cache = data;
		newData = false;
		res.status(200).json({ data, error: false });
	} catch (e) {
		console.log(e);
		return res.status(200).json({ msg: "No hay datos, por favor cargue un archivo", error: true });
	}
});

router.post("/products", multerMiddle, async (req: any, res) => {
	cache = [];
	newData = true;
	res.status(200).json({ data: "OK", error: false });
});

export = router;
