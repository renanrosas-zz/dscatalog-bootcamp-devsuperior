import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Category } from 'types/category';
import { Product } from 'types/product';
import { requestBackend } from 'util/requests';
import './styles.css';

type UrlParams = {
    productId: string;
}

const Form = () => {

    const { productId } = useParams<UrlParams>();

    const history = useHistory();

    const [selectCategories, setSelectCategories] = useState<Category[]>([]);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<Product>();

    const isEditing = productId !== 'create';

    useEffect(() => {
        requestBackend({url: '/categories'})
            .then(response => {
                setSelectCategories(response.data.content);
            })
    }, []);

    useEffect(() => {
        if (isEditing) {
            requestBackend({ url: `/products/${productId}` })
                .then((response) => {
                    const product = response.data as Product;
                    setValue('name', product.name);
                    setValue('price', product.price);
                    setValue('description', product.description);
                    setValue('imgUrl', product.imgUrl);
                    setValue('categories', product.categories);
                })
        }
    }, [isEditing, productId, setValue])

    const onSubmit = (formData: Product) => {

        const data = {
            ...formData,
            imgUrl: isEditing ? formData.imgUrl : "https://raw.githubusercontent.com/devsuperior/dscatalog-resources/master/backend/img/1-big.jpg",
            categories: isEditing ? formData.categories : [{ id: 1, name: "" }]
        }

        const config: AxiosRequestConfig = {
            method: isEditing ? 'PUT' : 'POST',
            url: isEditing ? `/products/${productId}` : "/products",
            data: data,
            withCredentials: true
        };

        requestBackend(config)
            .then(() => {
                history.push("/admin/products");
            });
    };

    const handleCancel = () => {
        history.push("/admin/products");
    }

    return (
        <div className="product-crud-container">
            <div className="base-card product-crud-form-card">
                <h1>DADOS DO PRODUTO</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row product-crud-inputs-container">
                        <div className="col-lg-6 product-crud-inputs-left">
                            <div className="margin-bottom-30 ">
                                <input
                                    {...register("name", {
                                        required: 'Campo obrigatório',
                                    })}
                                    type="text"
                                    className={`form-control base-input ${errors.name ? 'is-invalid' : ''}`}
                                    placeholder="Nome do produto"
                                    name="name"
                                />
                                <div className="invalid-feedback d-block">{errors.name?.message}</div>
                            </div>

                            <div className="margin-bottom-30 ">
                                <Select 
                                    options={selectCategories}
                                    classNamePrefix="product-crud-select"
                                    isMulti
                                    getOptionLabel={(cateogry: Category) => cateogry.name}
                                    getOptionValue={(cateogry: Category) => String(cateogry.id)}
                                />
                            </div>

                            <div className="margin-bottom-30 ">
                                <input
                                    {...register("price", {
                                        required: 'Campo obrigatório',
                                    })}
                                    type="text"
                                    className={`form-control base-input ${errors.price ? 'is-invalid' : ''}`}
                                    placeholder="Preço"
                                    name="price"
                                />
                                <div className="invalid-feedback d-block">{errors.price?.message}</div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div>
                                <textarea
                                    rows={10}
                                    {...register("description", {
                                        required: 'Campo obrigatório',
                                    })}
                                    className={`form-control base-input h-auto ${errors.description ? 'is-invalid' : ''}`}
                                    placeholder="Descrição"
                                    name="description"
                                />
                                <div className="invalid-feedback d-block">{errors.description?.message}</div>
                            </div>
                        </div>
                    </div>
                    <div className="product-crud-form-buttons-container">
                        <button
                            className="btn btn-outline-danger product-form-btn"
                            onClick={handleCancel}
                        >CANCELAR</button>
                        <button className="btn btn-primary text-white product-form-btn">SALVAR</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;