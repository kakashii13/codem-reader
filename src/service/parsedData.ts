// Regex
const cuilRegex = /CUIL\/T: ([\d\-]+)/;
const documentoRegex = /Tipo y N Documento: [A-Z]+ - (\d+)/;
const nombreApellidoRegex = /Nombre y Apellido :(.+)Fecha de Nacimiento/;
const fechaNacimientoRegex = /Fecha de Nacimiento: (\d{2}\/\d{2}\/\d{4})/;
const cuitEmpleadorRegex = /CUIT Empleador: ([\d\-]+)/;
const situacionRevistaRegex = /Situación de Revista: (.+)/;
const codigoOsRegex = /Código: (\d+)/;
const denominacionOsRegex = /Denominación: (.+)/;

// Function to parse data
function parseData(text: any | undefined) {
  if (text === undefined) {
    return {};
  }
  const cuilMatch = text.match(cuilRegex);
  const documentoMatch = text.match(documentoRegex);
  const nombreApellidoMatch = text.match(nombreApellidoRegex);
  const fechaNacimientoMatch = text.match(fechaNacimientoRegex);
  const cuitEmpleadorMatch = text.match(cuitEmpleadorRegex);
  const situacionRevistaMatch = text.match(situacionRevistaRegex);
  const codigoOsMatch = text.match(codigoOsRegex);
  const denominacionOsMatch = text.match(denominacionOsRegex);

  const parsedData = {
    "CUIL/T": cuilMatch ? cuilMatch[1] : "",
    documento: documentoMatch ? documentoMatch[1] : "",
    "nombre y apellido": nombreApellidoMatch
      ? nombreApellidoMatch[1].trim()
      : "",
    "fecha de nacimiento": fechaNacimientoMatch ? fechaNacimientoMatch[1] : "",
    "cuit empleador": cuitEmpleadorMatch ? cuitEmpleadorMatch[1] : "",
    "situacion de revista": situacionRevistaMatch
      ? situacionRevistaMatch[1]
      : "",
    "codigo os": codigoOsMatch ? codigoOsMatch[1] : "",
    denominacion: denominacionOsMatch ? denominacionOsMatch[1].trim() : "",
  };

  return parsedData;
}

export { parseData };
