import React from "react";
import { useForm } from "react-hook-form";

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    try {

      {/* obteniendo el token CSRF*/ }
      const csrfResponse = await fetch("http://127.0.0.1:8000/api/csrf_token/", {
        method: 'GET',
        credentials: 'include'
      });
      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.csrfToken;

      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const response = await response.json();
        alert("Registro exitoso");

        // Guardar los tokens en local localStorage 
        localStorage.setItem('accessToken', responseData.tokens.access);
        localStorage.setItem('refreshToken', responseData.tokens.refresh);

        {/* redirigir al usuario */ }
        window.location.href = '/dashboard';

      } else {
        const errorData = await response.json();
        alert(`Error en el registro: ${errorData.message}`);
      }
    } catch (error) {
      alert("Error en la conexion");
      console.error("Error:", error)
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="flex justify-center min-h-screen">
        <div
          className="hidden bg-cover lg:block lg:w-2/5"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1494621930069-4fd4b2e24a11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80')",
          }}
        >
        </div>

        <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
          <div className="w-full">
            <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
              Crea tu cuenta.
            </h1>

            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Creemos tu cuenta para que puedas empezar a adquirir conocimientos
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
            >
              {/* Campo Nombre */}
              <div>
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="John"
                  {...register("firstName",
                    {
                      required: {
                        value: true,
                        message: "Este campo es requerido"
                      },
                      minLength: {
                        value: 2,
                        message: "El nombre debe tener mas de dos caracteres"
                      },
                      maxLength: {
                        value: 20,
                        message: "El nombre es demasiado largo"
                      }
                    })}
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
                {errors.firstName && (
                  <p role="alert" className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Campo Apellido */}
              <div>
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Apellido
                </label>
                <input
                  type="text"
                  placeholder="Snow"
                  {...register("lastName", { required: "Este campo es obligatorio" })}
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Campo cedula */}
              <div>
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Cedula
                </label>
                <input
                  type="text"
                  placeholder="Cedula"
                  {...register("cedula",
                    {
                      required: {
                        value: true,
                        message: "Este campo es requerido"
                      },
                      pattern: {
                        value: /^\d{7,8}$/,
                        message: "La cedula deve tener entre 7 y 8 caracteres y solo contener numeros"
                      },
                      maxLength: {
                        value: 11,
                        message: "El numero de cedula es demasiado largo"
                      }
                    })}
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
                {errors.cedula && (
                  <p role="alert" className="text-red-500 text-sm mt-1">
                    {errors.cedula.message}
                  </p>
                )}
              </div>

              {/* Campo Nickname */}
              <div>
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  placeholder="Snow"                  {...register("nickName", { required: "Este campo es obligatorio" })}
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
                {errors.nickName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nickName.message}
                  </p>
                )}
              </div>

              {/* Campo Telefono */}
              <div>
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Número de teléfono
                </label>
                <input
                  type="text"
                  placeholder="XXX-XX-XXXX-XXX"
                  {...register("phone", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: /^\d{4}\d{3}\d{2}\d{2}$/,
                      message: "Formato inválido (XXXX-XXX-XX-XX)",
                    },
                  })}
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Campo Correo */}
              <div>
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Dirección de correo
                </label>
                <input
                  type="email"
                  placeholder="johnsnow@example.com"
                  {...register("email", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo electrónico inválido",
                    },
                  })}
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Campo fecha naciemiento */}
              <div>
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Fecha de naciemiento
                </label>
                <input
                  type="date"
                  placeholder="01/01/2000"
                  {...register("birthDate", {
                    required: {
                      value: true,
                      message: "Este campo es requerido"
                    },
                    validate: (value) => {
                      const birthDate = new Date(value);
                      const today = new Date();
                      return birthDate <= today || "La fecha de naciemiento no puede ser futura";
                    },
                  })}
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>

              {/* Campo Contraseña */}
              <div>
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Este campo es obligatorio",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  })}
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Campo confirmar contraseña */}
              <div>
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("confirmPassword", {
                    required: "Este campo es obligatorio",
                    validate: (value) =>
                      value === watch("password") || "Las contraseñas no coinciden",
                  })}
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
              >
                <span>Registrarse </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 rtl:-scale-x-100"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
