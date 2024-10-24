// Importar las funciones que necesitas desde la SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDGOoh_Pm0U_VFrerll6fl87oA4fD-9gYI",
    authDomain: "bitacora-sharon.firebaseapp.com",
    projectId: "bitacora-sharon",
    storageBucket: "bitacora-sharon.appspot.com",
    messagingSenderId: "498940752104",
    appId: "1:498940752104:web:c93a29e7656ed99872595d",
    measurementId: "G-92QZZBV9LV"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Manejar el envío del formulario
document.getElementById('studyForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const subject = document.getElementById('subject').value;
    const date = document.getElementById('date').value;
    const hours = document.getElementById('hours').value;

    // Guardar datos en Firebase
    set(ref(database, 'datos/' + date), {
        subject: subject,
        date: date,
        hours: hours
    }).then(() => {
        console.log('Datos guardados en Firebase');
        alert('Registro guardado');
        document.getElementById('studyForm').reset();
    }).catch((error) => {
        console.error('Error al guardar datos: ', error);
    });
});

// Cargar los datos de Firebase y mostrarlos
const datosRef = ref(database, 'datos/');
onValue(datosRef, (snapshot) => {
    const data = snapshot.val();
    const output = document.getElementById('output');
    output.innerHTML = '';

    if (data) {
        for (let key in data) {
            output.innerHTML += `<p>${data[key].date}: ${data[key].subject} - ${data[key].hours} horas</p>`;
        }
    } else {
        output.innerHTML = '<p>No hay registros.</p>';
    }
});

// Exportar a Excel (CSV)
document.getElementById('exportButton').addEventListener('click', function() {
    const datosRef = ref(database, 'datos/');
    onValue(datosRef, (snapshot) => {
        const data = snapshot.val();
        let csvContent = "data:text/csv;charset=utf-8,Fecha,Materia,Horas\n";

        if (data) {
            for (let key in data) {
                const row = `${data[key].date},${data[key].subject},${data[key].hours}\n`;
                csvContent += row;
            }
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "datos_estudio.csv");
        document.body.appendChild(link);
        link.click();
    });
});
