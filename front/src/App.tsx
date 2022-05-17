import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import { getProducts, postProducts } from "./services/index";

export interface IProduct {
	linea: string;
	categoria: string;
	empresa: string;
	producto: number;
	precio: number;
	fecha_precio: Date;
	stock: number;
}

interface IFilter {
	line: string;
	category: string;
}

function App() {
	//
	const [products, setProducts] = useState<IProduct[]>([]);
	const [lines, setLines] = useState<string[]>([]);
	const [categorys, setCategorys] = useState<string[]>([]);
	const [filter, setFilter] = useState<IFilter>({ line: "0", category: "0" });
	const [filterProducts, setFilterProducts] = useState<IProduct[]>([]);
	const [error, setError] = useState<string>();
	//
	const getAllProducts = async () => {
		const { data, error, msg } = await getProducts();
		if (error) return setError(msg);
		if (data) {
			setError(undefined);
			setProducts(data);
			setFilterProducts(data);
		}
	};

	const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, type: string) => {
		if (type === "line") setFilter({ ...filter, line: e.target.value });
		if (type === "category") setFilter({ ...filter, category: e.target.value });
	};

	const getAllFilters = () => {
		const linesMap = products.map((product) => product.linea);
		const categorysMap = products.map((product) => product.categoria);
		const linesSet = new Set(linesMap);
		const categorysSet = new Set(categorysMap);
		setLines([...linesSet]);
		setCategorys([...categorysSet]);
	};

	const handleInputChange = async (e: any) => {
		e.preventDefault();
		if (e.target.files.length == 0) return;
		await postProducts(e.target.files[0]);
		await getAllProducts();
	};

	useEffect(() => {
		getAllProducts();
	}, []);

	useEffect(() => {
		getAllFilters();
	}, [products]);

	useEffect(() => {
		const filtrados = products.filter((product) => {
			return (product.linea === filter.line || filter.line === "0") && (product.categoria === filter.category || filter.category === "0");
		});
		setFilterProducts(filtrados);
	}, [filter]);

	return (
		<>
			<h1 className="text-center mb-3 mt-5">Metalúrgica Baccin</h1>
			<div className="text-center mt-3">
				<input id="fileInput" onChange={async (e) => await handleInputChange(e)} type="file" />
			</div>
			<br />
			<div className="p-5 w-100">
				<div>
					<select
						value={filter.line}
						onChange={(e) => handleSelectChange(e, "line")}
						className="form-select text-center"
						aria-label="Filtrar por linea"
					>
						<option value={"0"}>Filtrar por linea</option>
						{lines.length > 0 &&
							lines.map((line) => (
								<option key={Math.random()} value={line}>
									{line}
								</option>
							))}
					</select>
				</div>
				<div className="mt-3">
					<select
						value={filter.category}
						onChange={(e) => handleSelectChange(e, "category")}
						className="form-select text-center"
						aria-label="Filtrar por categoría"
					>
						<option value={"0"}>Filtrar por Categoría</option>
						{categorys.length > 0 &&
							categorys.map((line) => (
								<option key={Math.random()} value={line}>
									{line}
								</option>
							))}
					</select>
				</div>
			</div>

			<br />

			{/* Error Case */}
			{error ? (
				<div className="text-center">{error}</div>
			) : filterProducts.length > 0 ? (
				<div className="table-responsive">
					<table className="table table-striped table-bordered">
						<thead>
							<tr>
								<th scope="col">Linea</th>
								<th scope="col">Categoria</th>
								<th scope="col">Producto</th>
								<th scope="col">Precio</th>
								<th scope="col">Fecha Precio</th>
								<th scope="col">Stock</th>
							</tr>
						</thead>
						<tbody>
							{filterProducts.map((product) => (
								//<tr key={product.producto}>
								<tr key={Math.random()}>
									<th scope="row">{product.linea}</th>
									<td>{product.categoria}</td>
									<td>{product.producto}</td>
									<td>$ {product.precio}</td>
									<td>{new Date(product.fecha_precio).toLocaleDateString()}</td>
									<td>{product.stock}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : products.length === 0 ? (
				<div className="text-center my-5">
					<h1>Cargando...</h1>
				</div>
			) : (
				<div className="text-center my-5">
					<h1>No se encuentran productos con esos filtros...</h1>
				</div>
			)}
		</>
	);
}

export default App;
