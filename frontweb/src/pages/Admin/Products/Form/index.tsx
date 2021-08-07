import './styles.css';

const Form = () => {
    return (
        <div className="product-crud-container">
            <div className="base-card product-crud-form-card">
                <h1>DADOS DO PRODUTO</h1>
                <form action="">
                    <div className="row product-crud-inputs-container">
                        <div className="col-lg-6 product-crud-inputs-left">
                            <div className="margin-bottom-30 ">
                                <input type="text" className="form-control base-input" />
                            </div>
                            <div className="margin-bottom-30 ">
                                <input type="text" className="form-control base-input" />
                            </div>
                            <div>
                                <input type="text" className="form-control base-input" />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div>
                                <textarea name="" rows={10} className="form-control base-input h-auto" />
                            </div>
                        </div>
                    </div>
                    <div className="product-crud-form-buttons-container">
                        <button className="btn btn-outline-danger product-form-btn">CANCELAR</button>
                        <button className="btn btn-primary text-white product-form-btn">SALVAR</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;