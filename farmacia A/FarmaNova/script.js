/* ============================================================
   FarmaNova · catálogo y pedido
   Para cambiar productos o precios, edita la lista de abajo.
   ============================================================ */

const WHATSAPP = "18095508839";

const medicamentos = [
  { id: 1,  nombre: "Paracetamol 500 mg",       cat: "Dolor y fiebre",   precio: 85,  desc: "Alivia el dolor leve y baja la fiebre. Caja de 10 tabletas." },
  { id: 2,  nombre: "Ibuprofeno 400 mg",        cat: "Dolor y fiebre",   precio: 120, desc: "Antiinflamatorio para dolor muscular, de cabeza y dental. Caja de 10." },
  { id: 3,  nombre: "Naproxeno 550 mg",         cat: "Dolor y fiebre",   precio: 190, desc: "Calma dolores articulares y menstruales por más tiempo. Caja de 10." },
  { id: 4,  nombre: "Aspirina 100 mg",          cat: "Dolor y fiebre",   precio: 140, desc: "Analgésico y antiagregante plaquetario. Frasco de 30 tabletas." },
  { id: 5,  nombre: "Loratadina 10 mg",         cat: "Alergia y gripe",  precio: 110, desc: "Antihistamínico para rinitis, picazón y estornudos. Caja de 10." },
  { id: 6,  nombre: "Cetirizina 10 mg",         cat: "Alergia y gripe",  precio: 130, desc: "Controla la alergia estacional y la urticaria. Caja de 10." },
  { id: 7,  nombre: "Jarabe para la tos",       cat: "Alergia y gripe",  precio: 240, desc: "Alivia la tos seca y la irritación de garganta. Frasco de 120 ml." },
  { id: 8,  nombre: "Descongestionante nasal",  cat: "Alergia y gripe",  precio: 175, desc: "Despeja la nariz tapada en minutos. Atomizador de 15 ml." },
  { id: 9,  nombre: "Omeprazol 20 mg",          cat: "Estómago",         precio: 210, desc: "Reduce la acidez y el reflujo. Caja de 14 cápsulas." },
  { id: 10, nombre: "Sales de rehidratación",   cat: "Estómago",         precio: 65,  desc: "Repone líquidos y sales en casos de diarrea o vómitos. Sobre individual." },
  { id: 11, nombre: "Antiácido masticable",     cat: "Estómago",         precio: 95,  desc: "Alivio rápido de la agruras y el malestar estomacal. Caja de 12." },
  { id: 12, nombre: "Vitamina C 1000 mg",       cat: "Vitaminas",        precio: 320, desc: "Refuerza las defensas del cuerpo. Tubo de 10 tabletas efervescentes." },
  { id: 13, nombre: "Complejo B",               cat: "Vitaminas",        precio: 260, desc: "Apoya la energía y el sistema nervioso. Frasco de 30 tabletas." },
  { id: 14, nombre: "Multivitamínico diario",   cat: "Vitaminas",        precio: 480, desc: "Vitaminas y minerales esenciales para toda la familia. Frasco de 60." },
  { id: 15, nombre: "Alcohol isopropílico",     cat: "Cuidado personal", precio: 90,  desc: "Antiséptico para limpiar la piel y superficies. Botella de 250 ml." },
  { id: 16, nombre: "Curitas surtidas",         cat: "Cuidado personal", precio: 75,  desc: "Protegen pequeñas heridas y raspones. Caja de 20." },
  { id: 17, nombre: "Protector solar SPF 50",   cat: "Cuidado personal", precio: 690, desc: "Protección alta contra rayos UVA y UVB, resistente al agua. Tubo de 120 ml." },
  { id: 18, nombre: "Termómetro digital",       cat: "Cuidado personal", precio: 350, desc: "Lectura rápida y precisa, con pantalla clara y alarma de fiebre." },
];

const $ = (id) => document.getElementById(id);
const money = (n) => "RD$ " + n.toLocaleString("es-DO");

let categoria = "Todos";
const pedido = {}; // { idProducto: cantidad }

/* ---------- Catálogo ---------- */

function pintarFiltros() {
  const cats = ["Todos", ...new Set(medicamentos.map((m) => m.cat))];
  $("filters").innerHTML = cats
    .map((c) => `<button class="${c === categoria ? "on" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
}

function pintarCatalogo() {
  const lista = medicamentos.filter((m) => categoria === "Todos" || m.cat === categoria);
  $("grid").innerHTML = lista
    .map(
      (m) => `
      <article class="card">
        <span class="cat">${m.cat}</span>
        <h3>${m.nombre}</h3>
        <p>${m.desc}</p>
        <div class="row">
          <span class="price">${money(m.precio)}</span>
          <button class="add" data-id="${m.id}">Agregar</button>
        </div>
      </article>`
    )
    .join("");
}

/* ---------- Pedido ---------- */

function pintarPedido() {
  const ids = Object.keys(pedido);
  let total = 0, unidades = 0;

  $("cartList").innerHTML = ids.length
    ? ids.map((id) => {
        const m = medicamentos.find((x) => x.id == id);
        const q = pedido[id];
        total += m.precio * q;
        unidades += q;
        return `
          <li>
            <div><strong>${m.nombre}</strong><br><small>${money(m.precio)} c/u</small></div>
            <div class="qty">
              <button data-menos="${id}">−</button>
              <span>${q}</span>
              <button data-mas="${id}">+</button>
            </div>
          </li>`;
      }).join("")
    : `<li class="empty">Todavía no has agregado nada.</li>`;

  $("cartTotal").textContent = money(total);
  $("cartCount").textContent = unidades;
}

function cambiar(id, delta) {
  pedido[id] = (pedido[id] || 0) + delta;
  if (pedido[id] <= 0) delete pedido[id];
  pintarPedido();
}

function abrirPedido(abrir) {
  $("drawer").classList.toggle("open", abrir);
  $("veil").classList.toggle("show", abrir);
  $("drawer").setAttribute("aria-hidden", !abrir);
}

function enviarWhatsApp() {
  const ids = Object.keys(pedido);
  if (!ids.length) return alert("Agrega al menos un medicamento a tu pedido.");

  let total = 0;
  const lineas = ids.map((id) => {
    const m = medicamentos.find((x) => x.id == id);
    total += m.precio * pedido[id];
    return `• ${pedido[id]} x ${m.nombre} (${money(m.precio * pedido[id])})`;
  });

  const mensaje = `Hola, quisiera hacer este pedido:\n${lineas.join("\n")}\n\nTotal: ${money(total)}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

/* ---------- Eventos ---------- */

$("filters").addEventListener("click", (e) => {
  if (!e.target.dataset.cat) return;
  categoria = e.target.dataset.cat;
  pintarFiltros();
  pintarCatalogo();
});

$("grid").addEventListener("click", (e) => {
  if (e.target.dataset.id) { cambiar(e.target.dataset.id, 1); abrirPedido(true); }
});

$("cartList").addEventListener("click", (e) => {
  if (e.target.dataset.mas) cambiar(e.target.dataset.mas, 1);
  if (e.target.dataset.menos) cambiar(e.target.dataset.menos, -1);
});

$("openCart").onclick = () => abrirPedido(true);
$("closeCart").onclick = () => abrirPedido(false);
$("veil").onclick = () => abrirPedido(false);
$("orderBtn").onclick = enviarWhatsApp;
$("clearBtn").onclick = () => { Object.keys(pedido).forEach((k) => delete pedido[k]); pintarPedido(); };

pintarFiltros();
pintarCatalogo();
pintarPedido();