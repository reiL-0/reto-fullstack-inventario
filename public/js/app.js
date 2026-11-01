const $ = (id) => document.getElementById(id);
if (!localStorage.token) location.href = 'index.html';
$('usuario').textContent = localStorage.nombre || '';

let editando = null; // id del producto en edición

async function api(path, method = 'GET', body) {
  const res = await fetch(`/api/products${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.token}` },
    body: body && JSON.stringify(body)
  });
  const data = await res.json();
  if (res.status === 401) return salir();
  if (!res.ok) throw new Error(data.error);
  return data;
}

function salir() { localStorage.clear(); location.href = 'index.html'; }
$('salir').onclick = salir;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

async function cargar() {
  const productos = await api('');
  $('vacio').hidden = productos.length > 0;
  $('lista').innerHTML = productos.map((p) => `
    <tr>
      <td>${esc(p.nombre)}</td><td>${esc(p.descripcion)}</td>
      <td>$${p.precio.toFixed(2)}</td><td>${p.stock}</td>
      <td class="actions">
        <button class="ghost" data-edit="${p._id}">Editar</button>
        <button class="danger" data-del="${p._id}">Eliminar</button>
      </td>
    </tr>`).join('');
  $('lista').productos = productos;
}

$('lista').onclick = async (e) => {
  const { edit, del } = e.target.dataset;
  try {
    if (del && confirm('¿Eliminar este producto?')) { await api(`/${del}`, 'DELETE'); await cargar(); }
    if (edit) {
      const p = $('lista').productos.find((x) => x._id === edit);
      for (const k of ['nombre', 'descripcion', 'precio', 'stock']) $(k).value = p[k];
      editando = edit;
      $('formTitulo').textContent = 'Editar producto';
      $('guardar').textContent = 'Guardar cambios';
      $('nombre').focus();
    }
  } catch (err) { $('error').textContent = err.message; }
};

$('form').onsubmit = async (e) => {
  e.preventDefault();
  $('error').textContent = '';
  const body = {
    nombre: $('nombre').value, descripcion: $('descripcion').value,
    precio: Number($('precio').value), stock: Number($('stock').value || 0)
  };
  try {
    await (editando ? api(`/${editando}`, 'PUT', body) : api('', 'POST', body));
    editando = null;
    $('form').reset();
    $('formTitulo').textContent = 'Nuevo producto';
    $('guardar').textContent = 'Agregar';
    await cargar();
  } catch (err) { $('error').textContent = err.message; }
};

cargar().catch((err) => { $('error').textContent = err.message; });
