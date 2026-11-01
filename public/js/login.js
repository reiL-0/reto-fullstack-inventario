const $ = (id) => document.getElementById(id);
let registro = false;

if (localStorage.token) location.href = 'app.html';

$('alternar').onclick = () => {
  registro = !registro;
  $('titulo').textContent = registro ? 'Crear cuenta' : 'Iniciar sesión';
  $('enviar').textContent = registro ? 'Registrarme' : 'Entrar';
  $('pregunta').textContent = registro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?';
  $('alternar').textContent = registro ? 'Inicia sesión' : 'Regístrate';
  $('campoNombre').hidden = !registro;
  $('error').textContent = '';
};

$('auth').onsubmit = async (e) => {
  e.preventDefault();
  const body = { email: $('email').value, password: $('password').value };
  if (registro) body.nombre = $('nombre').value;
  const res = await fetch(`/api/auth/${registro ? 'register' : 'login'}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) { $('error').textContent = data.error; return; }
  localStorage.token = data.token;
  localStorage.nombre = data.user.nombre;
  location.href = 'app.html';
};
