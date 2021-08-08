import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useForm, Controller } from 'react-hook-form';
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

    const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<Product>();

    const isEditing = productId !== 'create';

    useEffect(() => {
        requestBackend({ url: '/categories' })
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

        const data = {...formData, price: String(formData.price).replace(',', '.')}

        const config: AxiosRequestConfig = {
            method: isEditing ? 'PUT' : 'POST',
            url: isEditing ? `/products/${productId}` : "/products",
            data,
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
                                <Controller
                                    name="categories"
                                    rules={{ required: true }}
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field}
                                            options={selectCategories}
                                            classNamePrefix="product-crud-select"
                                            isMulti
                                            getOptionLabel={(cateogry: Category) => cateogry.name}
                                            getOptionValue={(cateogry: Category) => String(cateogry.id)}
                                        />
                                    )}
                                />
                                {errors.categories && (
                                    <div className="invalid-feedback d-block">Campo obrigatório</div>
                                )}
                            </div>

                            <div className="margin-bottom-30 ">
                                <Controller
                                    name="price"
                                    rules={{required: 'Campo obrigatório'}}
                                    control={control}
                                    render={({ field }) => (
                                        <CurrencyInput
                                            placeholder="Preço"
                                            className={`form-control base-input ${errors.price ? 'is-invalid' : ''}`}
                                            disableGroupSeparators={true}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        />
                                    )}
                                />
                                <div className="invalid-feedback d-block">{errors.price?.message}</div>
                            </div>

                            <div className="margin-bottom-30 ">
                                <input
                                    {...register("imgUrl", {
                                            required: 'Campo obrigatório',
                                            pattern: {
                                              value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm,
                                              message: 'Deve ser uma url válida'
                                            }
                                          })}
                                    type="text"
                                    className={`form-control base-input ${errors.imgUrl ? 'is-invalid' : ''}`}
                                    placeholder="Url da imagem do produto"
                                    name="imgUrl"
                                />
                                <div className="invalid-feedback d-block">{errors.imgUrl?.message}</div>
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