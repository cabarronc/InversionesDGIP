import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberFormatService {

  constructor() { }
   // 🟢 Formatea un número como moneda ($4,500,000.00)
   formatAsCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN',minimumFractionDigits:2 }).format(value);
  }

  // 🟢 Convierte un número a texto en español (Cuatro millones quinientos mil pesos 00/100 M.N.)
  numberToWords(numero: number): string {
    const unidades = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const unidades_especiales = ['cero', 'un', 'dós', 'trés', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const unidades_especiales_2 = ['cero', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
  
    function convertir2(num: number): string {
      if (num < 10) return unidades_especiales_2[num];
      if (num < 20) return especiales[num - 10];
      if (num === 20) return "veinte";
      if (num < 30) return "veinti" + (num % 10 === 1 ? "ún" : unidades_especiales[num % 10])
      if (num < 100) return decenas[Math.floor(num / 10)] + (num % 10 ? ' y ' + unidades_especiales_2[num % 10] : '');
      if (num < 1000) {
        let centenasValor = Math.floor(num / 100); // Obtener la parte de las centenas
        let resto = num % 100; // Obtener el resto (parte de decenas y unidades)

        if (centenasValor === 1 && resto === 0) {
            // Si es exactamente 100, decimos "cien"
            return 'cien';
        } else if (centenasValor === 1 && resto > 0) {
            // Si es entre 101 y 199, decimos "ciento [resto]"
            return 'ciento ' + convertir2(resto);
        } else {
            // Para otros casos, usamos la lógica normal para centenas
            return centenas[centenasValor] + (resto ? ' ' + convertir2(resto) : '');
        }
    }
      if (num < 1000000) {
        let miles = Math.floor(num / 1000);
        return (miles === 1 ? 'mil' : convertir2(miles) + ' mil') + (num % 1000 ? ' ' + convertir2(num % 1000) : '');
      }
      return 'Número demasiado grande';
    }

    function convertir(num: number): string {
      if (num < 10) return unidades_especiales_2[num];
      if (num < 20) return especiales[num - 10];
      if (num === 20) return "veinte";
      if (num < 30) return "veinti" + (num % 10 === 1 ? "ún" : unidades_especiales[num % 10])
      if (num < 100) return decenas[Math.floor(num / 10)] + (num % 10 ? ' y ' + unidades_especiales_2[num % 10] : '');
      // if (num < 1000) return centenas[Math.floor(num / 100)] + (num % 100 ? ' ' + convertir2(num % 100) : '');

      if (num < 1000) {
          let centenasValor = Math.floor(num / 100); // Obtener la parte de las centenas
          let resto = num % 100; // Obtener el resto (parte de decenas y unidades)

          if (centenasValor === 1 && resto === 0) {
              // Si es exactamente 100, decimos "cien"
              return 'cien';
          } else if (centenasValor === 1 && resto > 0) {
              // Si es entre 101 y 199, decimos "ciento [resto]"
              return 'ciento ' + convertir2(resto);
          } else {
              // Para otros casos, usamos la lógica normal para centenas
              return centenas[centenasValor] + (resto ? ' ' + convertir2(resto) : '');
          }
      }

    
      if (num < 1000000) {
        let miles = Math.floor(num / 1000);
        return (miles === 1 ? 'mil' : convertir2(miles) + ' mil') + (num % 1000 ? ' ' + convertir2(num % 1000) : '');
      }
   
      // if (num < 1000000000) {
      //   let millones = Math.floor(num / 1000000);
      //   return (millones === 1 ? 'Un millón de' : convertir2(millones) + ' millones') + (num % 1000000 ? ' ' + convertir2(num % 1000000) : '');
      // }
      if (num < 1000000000) {
        let millones = Math.floor(num / 1000000);
        let resto = num % 1000000; 
        let textoMillones = millones === 1 ? 'Un millón' : convertir2(millones) + ' millones';
        if (resto === 0) {
            return textoMillones + ' de';
        } else {
            return textoMillones + ' ' + convertir2(resto);
        }
    }
    
      return 'Número demasiado grande';
    }
    let partes = numero.toFixed(2).split('.');
    let enteros = parseInt(partes[0]);
    let centavos = parseInt(partes[1]);
    if (enteros !== 1){
      let texto = convertir(enteros) + ' pesos';
      texto += centavos > 0 ? ` ${centavos}/100 M.N.` : ' 00/100 M.N.';
      return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    else{
      let texto = convertir(enteros) + ' peso';
      texto += centavos > 0 ? ` ${centavos}/100 M.N.` : ' 00/100 M.N.';
      return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
   
  }
}
