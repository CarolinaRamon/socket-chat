// {
//     id: 'fgsdhfghgfhgfh',// socket.io genera un id único
//     nombre: 'Carolina',
//     sala: Video Juegos
// }



class Usuarios {

    constructor() {//Inicializa un arreglo de personas
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {

        let persona = { id, nombre, sala };

        this.personas.push(persona);//Agrego la persona al arreglo de personas del constructor.

        return this.personas;//Retorno todas las personas que están en el chat.

    }

    getPersona(id) {
        let persona = this.personas.filter(persona => persona.id === id)[0];//Si encuentra a alguien lo coloca en la posición cero, para que siempre haya un único registro.

        return persona;
    }

    getPersonas() {//Listo todas las personas que están en el chat.
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;
    }

    borrarPersona(id) {//Personas que se desconectan del chat.

        let personaBorrada = this.getPersona(id);//Guardo en una variable quién es antes de quitarla del arreglo.

        this.personas = this.personas.filter(persona => persona.id != id);//Regresa todas las personas, excepto la que se desconectó. Nuevo arreglo: personas activas en el chat.

        return personaBorrada;//Retorna quién se desconectó.

    }


}


module.exports = {
    Usuarios
}