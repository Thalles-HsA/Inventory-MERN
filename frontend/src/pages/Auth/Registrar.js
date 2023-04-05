import "./Auth.css"

// Validação e criação de usuário e formulário
import { Formik, Form, Field, ErrorMessage, FormikProvider } from "formik";
import validacaoUsuario from "../../controllers/validacaoUsuario"
import getInitialValues from "../../controllers/initialValues";


// Imagem e pré-carregamento
import imgRegistro from "./paginaregistro.png"

// Componentes
import Message from "../../components/Message/Message";
import Botao from '../../components/Botao/Botao'

// Hooks
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from 'react'

// Redux
import { register, reset } from "../../slices/authSlice";
import { Link } from "react-router-dom";

const Registrar = () => {

  const [etapa, setEtapa] = useState(1);
  const [voltando, setVoltando] = useState(false);
  const [tipo, setTipo] = useState("cnpj")
  const [valid, setValid] = useState(false)

  const dispatch = useDispatch();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const { loading, error } = useSelector((state) => state.auth);

  const handleProximo = async () => {

    const element = document.querySelector(`#etapa${etapa}`);

    if (element.classList.value === "animacao-entrar") {
      element.classList.remove("animacao-entrar")
      element.classList.add("animacao-sair");
    } else {
      element.classList.remove("animacao-voltar-entrar")
      element.classList.add("animacao-sair");
    }

    setTimeout(() => {
      setEtapa(etapa + 1);
      setVoltando(false)
      setValid(false)
    }, 600);




  }

  const handleAnterior = () => {

    const element = document.querySelector(`#etapa${etapa}`);

    if (element.classList.value === "animacao-entrar") {
      element.classList.remove("animacao-entrar")
      element.classList.add("animacao-voltar-sair");
    } else {
      element.classList.remove("animacao-voltar-entrar")
      element.classList.add("animacao-voltar-sair");
    }


    setTimeout(() => {
      setEtapa(etapa - 1);
      setVoltando(true)

    }, 600)

  }

  const initialValues = getInitialValues({ tipo: "cnpj" })

  const onSubmit = (values) => {
    console.log(values);

    if (etapa === 3) {
      dispatch(register(values))
    }
  }

  // Limpando todos os estados
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);


  return (

    <>
      <div className="auth-descricao animacao-voltar-entrar">
        <div >
          <h2>Cadastre-se agora no</h2>
          <h2 className="inventory">Inventory</h2>
        </div>
        <div>
          <p>Já tem uma conta?</p>
          <p>Faça seu <Link to="/login">Login aqui</Link></p>
        </div>
      </div>

      <img
        src={imgRegistro}
        alt="Caixas, carrinhos e prancheta"
        className="imagem-auth"
      />

      <FormikProvider>
        <Formik
          initialValues={initialValues}
          validateOnBlur={true}
          validationSchema={() => {
            if (tipo === "cnpj") {

              return validacaoUsuario.registrarcnpj
            } else {
              return validacaoUsuario.registrarcpf
            }
          }}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, isValid, errors, setFieldTouched, touched,
          }) => (
            <Form className="form-cadastro">

              <div
                id="etapa1"
                className={etapa === 1 && !voltando ? "animacao-entrar" : etapa === 1 && voltando ? "animacao-voltar-entrar" : "animacao-sair"}
                style={{ display: etapa === 1 ? "block" : "none" }}
              >
                <p>Primeiro coloque seu e-mail e senha</p>

                <Field type="email" placeholder='E-mail' name="email" innerRef={inputRef} />
                {valid && errors.email && <ErrorMessage name="email" component="span" />}

                <Field type="password" placeholder='Senha' name="senha" />
                {valid && errors.senha && <ErrorMessage name="senha" component="span" />}

                <Field type="password" placeholder='Confirme sua senha' name="confirmarSenha" />
                {valid && errors.confirmarSenha && <ErrorMessage name="confirmarSenha" component="span" />}


                <Botao
                  type="submit"
                  onClick={() => {
                    setValid(true)
                    if (
                      errors.email === undefined && 
                      errors.senha === undefined && 
                      errors.confirmarSenha === undefined) {
                      handleProximo()
                    }
                  }}
                  className="botao-proximo">
                  Proximo
                </Botao>
              </div>

              <div
                id="etapa2"
                className={etapa === 2 && !voltando ? "animacao-entrar" : etapa === 2 && voltando ? "animacao-voltar-entrar" : "animacao-sair"}
                style={{ display: etapa === 2 ? "block" : "none" }}
              >
                <p>Agora que tipo de cliente você é</p>

                <label>
                  <input type="radio" name="tipo" value="cnpj" onClick={() => setFieldValue('tipo', 'cnpj')}
                    onChange={() => setTipo("cnpj")} />
                  <span>CNPJ</span>
                </label>
                <label>
                  <input type="radio" name="tipo" value="cpf" onClick={() => setFieldValue('tipo', 'cpf')} onChange={() => setTipo("cpf")} />
                  <span>CPF</span>
                </label>

                {
                  values.tipo === "cnpj"
                    ? (
                      <>
                        <Field type="text" placeholder='Razão Social' name="razaoSocial" />
                        {valid && errors.razaoSocial && <ErrorMessage name="razaoSocial" component="span" />}

                        <Field type="text" placeholder='**.***.***/****-**' name="cnpj" />
                        {valid && errors.cnpj && <ErrorMessage name="cnpj" component="span" />}

                      </>
                    )
                    :
                    (
                      <>
                        <Field type="text" placeholder='Nome' name="nome" />
                        {valid && errors.nome && <ErrorMessage name="nome" component="span" />}

                        <Field type="text" placeholder='***.***.***-**' name="cpf" onBlur={() => setFieldTouched('cpf')} />
                        {valid && errors.cpf && <ErrorMessage name="cpf" component="span" />}

                      </>
                    )
                }
                <Botao
                  type="submit"
                  onClick={() => {
                    setValid(true)
                    
                    if (
                      errors.cnpj === undefined &&
                      errors.razaoSocial === undefined &&
                      errors.cpf === undefined &&
                      errors.nome === undefined
                      ) {
                      handleProximo()
                    }
                  }}
                  className="botao-proximo"
                >
                  Proximo
                </Botao >
                <Botao type="button" className="botao-voltar" onClick={handleAnterior}>
                  Voltar
                </Botao>
              </div>

              <div
                id="etapa3"
                className={etapa === 3 && !voltando ? "animacao-entrar" : etapa === 3 && voltando ? "animacao-voltar-sair" : "animacao-sair"}
                style={{ display: etapa === 3 ? "block" : "none" }}
              >
                <p>Por último seu endereço.</p>

                <Field type="text" placeholder='Logradouro' name="logradouro" />
                {valid && errors.logradouro && <ErrorMessage name="logradouro" component="span" className="message-error"/>}

                <Field className="input-menor" type="text" placeholder='Número' name="numero" />
                {valid && errors.numero && <ErrorMessage name="numero" component="span" />}

                <Field className="input-medio" type="text" placeholder='Complemento' name="complemento" />
                {valid && errors.complemento && <ErrorMessage name="complemento" component="span" />}

                <Field type="text" placeholder='Bairro' name="bairro" />
                {valid && errors.bairro && <ErrorMessage name="bairro" component="span" />}

                <Field type="text" placeholder='Cidade' name="cidade" />
                {valid && errors.cidade && <ErrorMessage name="cidade" component="span" />}

                <Field className="input-menor" type="text" placeholder='UF' name="estado" />
                {valid && errors.estado && <ErrorMessage name="estado" component="span" />}

                <Field className="input-medio" type="text" placeholder='CEP' name="cep" />
                {valid && errors.cep && <ErrorMessage name="cep" component="span" />}

                <Botao
                  type="submit"
                  className="botao-proximo"
                  onClick={() => {
                    setValid(true)
                  }}
                >
                  {loading ? 'Aguarde...' : 'Cadastrar'}
                </Botao>

                <Botao
                  type="button"
                  className="botao-voltar"
                  onClick={handleAnterior}
                >
                  Voltar
                </Botao>

                {error && <Message msg={error} type="error" />}
              </div>
            </Form>
          )}
        </Formik>
      </FormikProvider>

    </>
  )
}

export default Registrar