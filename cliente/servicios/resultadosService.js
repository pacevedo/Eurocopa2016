(function () {
	angular.module('servicios').service('resultadosService', resultadosService);


	function resultadosService($resource)  {
       
       var gruposStr = ['A', 'B', 'C', 'D', 'E', 'F'];
       var grupos = [];
       gruposStr.forEach(function(elem){
           var grupo = {
               nombre: elem,
               equipos: $resource("/api/pub/equipos?grupo="+elem).query(),
               partidos: $resource("/api/pub/partidos?grupo="+elem).query()
           }
           grupos.push(grupo);
       });
       this.grupos = grupos;
       this.octavos = $resource("/api/pub/partidos?fase=Octavos").query();
       this.octavosAlta = $resource("/api/pub/partidos?fase=Octavos&parte=alta").query();
       this.octavosBaja = $resource("/api/pub/partidos?fase=Octavos&parte=baja").query();
       this.cuartos = $resource("/api/pub/partidos?fase=Cuartos").query();
       this.cuartosAlta = $resource("/api/pub/partidos?fase=Cuartos&parte=alta").query();
       this.cuartosBaja = $resource("/api/pub/partidos?fase=Cuartos&parte=baja").query();
       this.semis = $resource("/api/pub/partidos?fase=Semis").query();
       this.semisAlta = $resource("/api/pub/partidos?fase=Semis&parte=alta").query();
       this.semisBaja = $resource("/api/pub/partidos?fase=Semis&parte=baja").query();
       this.final = $resource("/api/pub/partidos?fase=Final").query();
       
       var combinacionesTercerosGrupos = {
            "ABCD": {
                "CDE": "C",
                "ACD": "D",
                "ABF": "A",
                "BEF": "B"
            },
            "ABCE": {
                "CDE": "C",
                "ACD": "A",
                "ABF": "B",
                "BEF": "E"
            },
            "ABCF": {
                "CDE": "C",
                "ACD": "A",
                "ABF": "B",
                "BEF": "F"
            },
            "ABDE": {
                "CDE": "D",
                "ACD": "A",
                "ABF": "B",
                "BEF": "E" 
            },
            "ABDF": {
                "CDE": "D",
                "ACD": "A",
                "ABF": "B",
                "BEF": "F" 
            },
            "ABEF": {
                "CDE": "E",
                "ACD": "A",
                "ABF": "B",
                "BEF": "F" 
            },
            "ACDE": {
                "CDE": "C",
                "ACD": "D",
                "ABF": "A",
                "BEF": "E" 
            },
            "ACDF": {
                "CDE": "C",
                "ACD": "D",
                "ABF": "A",
                "BEF": "F" 
            },
            "ACEF": {
                "CDE": "C",
                "ACD": "A",
                "ABF": "F",
                "BEF": "E" 
            },
            "ADEF": {
                "CDE": "D",
                "ACD": "A",
                "ABF": "F",
                "BEF": "E" 
            },
            "BCDE": {
                "CDE": "C",
                "ACD": "D",
                "ABF": "B",
                "BEF": "E" 
            },
            "BCDF": {
                "CDE": "C",
                "ACD": "D",
                "ABF": "B",
                "BEF": "F" 
            },
            "BCEF": {
                "CDE": "E",
                "ACD": "C",
                "ABF": "B",
                "BEF": "F" 
            },
            "BDEF": {
                "CDE": "E",
                "ACD": "D",
                "ABF": "B",
                "BEF": "F" 
            },
            "CDEF": {
                "CDE": "C",
                "ACD": "D",
                "ABF": "F",
                "BEF": "E" 
            }      
        }
       
        /**
         * Función que calcula la clasificación del grupo
         */
        this.setClasificacionGrupo = function (grupo, grupos, octavosAlta, octavosBaja, octavos){
            reiniciarPuntuacion(grupo);
            getPuntosEquipo(grupo.partidos, grupo.equipos, true);
            getPuntosEquipo(grupo.partidos, grupo.equipos, false);
            setPosiciones(grupo.partidos, grupo.equipos);
            setDesempates(grupo.partidos, grupo.equipos);
            if (grupoCompleto(grupo.equipos)){
                setOctavos(grupo.equipos, grupo.nombre, octavosAlta, octavosBaja, octavos);
            }
            if (todosGruposCompletos(grupos)){
                setTercerosOctavos(grupos, octavosAlta, octavosBaja, octavos);
            }
        }
        
        
        
        /**
         * Función que calcula los puntos, goles a favor y en contra para cada equipo
         */
        function getPuntosEquipo(partidos, equipos, local){
            partidos.forEach(function(partido){
                var idEquipo = local?partido.equipoLocal[0].id:partido.equipoVisitante[0].id;
                var golesFavor = local?partido.golesLocal:partido.golesVisitante;
                var golesContra = local?partido.golesVisitante:partido.golesLocal;
                
                if (golesFavor !== undefined && golesContra !== undefined && golesFavor !== null && golesContra !== null) {
                    var ind = getIndexEquipo(equipos, idEquipo);
                    var puntos = equipos[ind].puntos;
                    var gf = equipos[ind].golesFavor;
                    var gc = equipos[ind].golesContra;
                    var jugados = equipos[ind].jugados;
                    if (golesFavor > golesContra) {
                        puntos += 3;
                    } else if (golesFavor == golesContra){
                        puntos++;
                    }
                    jugados++;             
                    equipos[ind].puntos = puntos;
                    equipos[ind].jugados = jugados;
                    equipos[ind].golesFavor = gf+golesFavor;
                    equipos[ind].golesContra = gc+golesContra;
                }
            });
        }
        
        function getIndexEquipo(arrayEquipos, id){
            for (var i=0; i<arrayEquipos.length; i++){
                if (arrayEquipos[i].id == id) return i;
            }
            return null;
        }
        
        function reiniciarPuntuacion(grupo){
            grupo.equipos.forEach(function(equipo){
                equipo.puntos = 0; 
                equipo.jugados = 0;
                equipo.golesFavor = 0;
                equipo.golesContra = 0;
            });
        }
        
        function setPosiciones(partidos, equipos){
            ordenarPuestos(equipos, 1, false, false, false);
        }
        
        function ordenarPuestos(equipos, inicio, goles, terceros, alfabetico){
            var puesto;
            for (var i = 0; i< equipos.length; i++){
                puesto = inicio;
                for (var j = 0; j<equipos.length; j++){
                    if (j != i) {
                        if (equipos[i].puntos < equipos[j].puntos) {
                            puesto++;
                        } else if (goles) {
                            var diferencia1 = equipos[i].golesFavor - equipos[i].golesContra;
                            var diferencia2 = equipos[j].golesFavor - equipos[j].golesContra;
                            if (diferencia1 < diferencia2) {
                                puesto++;
                            } else if (diferencia1 == diferencia2 && equipos[i].golesFavor < equipos[j].golesFavor) {
                                puesto++;
                            }
                        } else if (alfabetico){
                            if (equipos[i].id > equipos[j].id){
                                puesto++;
                            }
                        }
                    }
                }
                if (terceros) {
                    equipos[i].puestoTercero = puesto;
                } else {
                    equipos[i].puesto = puesto;
                }
            }
        }
        
        function setDesempates (partidos, equipos){
            var empates = getEmpates(equipos, false);
            deshacerEmpatesParticular(empates, partidos, equipos);
            empates = getEmpates(equipos, false);
            deshacerEmpatesGeneral(empates, partidos, equipos); 
        }
        
        function getEmpates(equipos, terceros){
            var empates = inicializaArray(equipos.length);
            var equiposEmp = [];
            var puesto;
            var varPuesto = terceros?"puestoTercero":"puesto";
            for (var i = 0; i< equipos.length; i++){
                for (var j = 0; j<equipos.length; j++){
                    if (i != j) {
                        if (equipos[i][varPuesto] == equipos[j][varPuesto]){
                            puesto = equipos[i][varPuesto];
                            if (empates[puesto] == null) {
                                equiposEmp = []
                            } else {
                                equiposEmp = empates[puesto];
                            }
                            if (!contiene(equiposEmp,equipos[i].id)) {
                                equiposEmp.push(equipos[i].id);
                            }
                            if (!contiene(equiposEmp,equipos[j].id)) {
                                equiposEmp.push(equipos[j].id);
                            }
                            empates[puesto] = equiposEmp;
                        }
                    }
                }
            }
            return empates;
        }
        
        function inicializaArray(longitud){
            var array = [];
            for (var i=0; i<longitud; i++){
                array[i] = null;
            }
            return array;
        }
        
        function contiene(array, elemento) {
            if (array != null && array.indexOf(elemento)>-1) return true;
            else return false;
        }
        
        /**
         * Desempate con goalaverage particular
         */
        function deshacerEmpatesParticular(empates, partidos, equipos) {
            for (var i = 0; i < empates.length; i++){
                if (empates[i] != null){
                    equiposEmpatados = getGoalAverageParticular(empates[i], partidos);
                    if (esGoalAverageParticularCompleto(empates[i],equiposEmpatados)) {
                        ordenarPuestos(equiposEmpatados, i, true, false, false);
                        setNuevosPuestos(equiposEmpatados, equipos, false);
                    }
                }
            }
        }
        
        function deshacerEmpatesGeneral(empates, partidos, equipos){
            for (var i = 0; i < empates.length; i++){
                if (empates[i] != null){
                    equiposEmpatados = getGoalAverageGeneral(empates[i], partidos);
                    ordenarPuestos(equiposEmpatados, i, true, false, false);
                    setNuevosPuestos(equiposEmpatados, equipos, false);
                }
            }
        }
        
        function getGoalAverageParticular(empate, partidos){
            var equiposEmpatados = [];
            var puntosLocal;
            var puntosVisitante;
            var datosLocal;
            var datosVisitante;
            var indLocal;
            var indVisitante;
            partidos.forEach(function(partido){
                var idEquipoLocal = partido.equipoLocal[0].id;
                var idEquipoVisitante = partido.equipoVisitante[0].id;
                var golesLocal = partido.golesLocal;
                var golesVisitante = partido.golesVisitante;
                if (hayResultado(golesLocal, golesVisitante) && contiene(empate,idEquipoLocal) && contiene(empate,idEquipoVisitante)){
                    puntosLocal = 0;
                    puntosVisitante = 0;
                    if (golesLocal > golesVisitante){
                        puntosLocal = 3;
                    } else if (golesLocal == golesVisitante){
                        puntosLocal = 1;
                        puntosVisitante = 1;
                    } else {
                        puntosVisitante = 3;
                    }
                    indLocal = getIndexEquipo(equiposEmpatados,idEquipoLocal);
                    indVisitante = getIndexEquipo(equiposEmpatados, idEquipoVisitante);
                    if (indLocal == null){
                        datosLocal = {id: idEquipoLocal, puntos: puntosLocal, jugados: 1, golesFavor: golesLocal, golesContra: golesVisitante};
                        equiposEmpatados.push(datosLocal);
                    } else {
                        equiposEmpatados[indLocal].puntos = equiposEmpatados[indLocal].puntos + puntosLocal;
                        equiposEmpatados[indLocal].jugados = equiposEmpatados[indLocal].jugados + 1;
                        equiposEmpatados[indLocal].golesFavor = equiposEmpatados[indLocal].golesFavor +  golesLocal;
                        equiposEmpatados[indLocal].golesContra = equiposEmpatados[indLocal].golesContra + golesVisitante;
                    }
                    
                    if (indVisitante == null){
                        datosVisitante = {id: idEquipoVisitante, puntos: puntosVisitante, jugados: 1, golesFavor: golesVisitante, golesContra: golesLocal};
                        equiposEmpatados.push(datosVisitante);
                    } else {
                        equiposEmpatados[indVisitante].puntos = equiposEmpatados[indVisitante].puntos + puntosVisitante;
                        equiposEmpatados[indVisitante].jugados = equiposEmpatados[indVisitante].jugados + 1;
                        equiposEmpatados[indVisitante].golesFavor = equiposEmpatados[indVisitante].golesFavor + golesVisitante;
                        equiposEmpatados[indVisitante].golesContra = equiposEmpatados[indVisitante].golesContra + golesLocal;
                    }
                }
            });
            return equiposEmpatados;
        }
        
        function esGoalAverageParticularCompleto (empates, equiposEmpatados){
            if (empates.length != equiposEmpatados.length) {
                return false;
            }
            var partidosJugar = empates.length-1;
            for (var i=0; i<equiposEmpatados.length; i++){
                if (equiposEmpatados[i].jugados<partidosJugar) {
                    return false;
                }
            }
            return true;
        }
        
        function getGoalAverageGeneral(empate, partidos){
            var indLocal;
            var indVisitante;
            var datosLocal;
            var datosVisitante;
            var equiposEmpatados = [];
            partidos.forEach(function(partido){
                var idEquipoLocal = partido.equipoLocal[0].id;
                var idEquipoVisitante = partido.equipoVisitante[0].id;
                var golesLocal = partido.golesLocal;
                var golesVisitante = partido.golesVisitante;
                if (!hayResultado(golesLocal, golesVisitante)){
                    golesLocal = 0;
                    golesVisitante = 0;
                }
                
                if (contiene(empate,idEquipoLocal)){
                    indLocal = getIndexEquipo(equiposEmpatados,idEquipoLocal);
                    if (indLocal == null){
                        datosLocal = {id: idEquipoLocal, puntos: 0, golesFavor: golesLocal, golesContra: golesVisitante};
                        equiposEmpatados.push(datosLocal);
                    } else {
                        equiposEmpatados[indLocal].golesFavor = equiposEmpatados[indLocal].golesFavor +  golesLocal;
                        equiposEmpatados[indLocal].golesContra = equiposEmpatados[indLocal].golesContra + golesVisitante;
                    }
                }
                
                if (contiene(empate,idEquipoVisitante)){
                    indVisitante = getIndexEquipo(equiposEmpatados,idEquipoVisitante);
                    if (indVisitante == null){
                        datosVisitante = {id: idEquipoVisitante, puntos: 0, golesFavor: golesVisitante, golesContra: golesLocal};
                        equiposEmpatados.push(datosVisitante);
                    } else {
                        equiposEmpatados[indVisitante].golesFavor = equiposEmpatados[indVisitante].golesFavor + golesVisitante;
                        equiposEmpatados[indVisitante].golesContra = equiposEmpatados[indVisitante].golesContra + golesLocal;
                    }
                }
            });
            return equiposEmpatados;
        }
        
        function setNuevosPuestos(equiposEmpatados, equipos, terceros){
            var varPuesto = terceros ? "puestoTercero":"puesto";
            for (var i = 0; i< equiposEmpatados.length; i++){
                var equipo = equiposEmpatados[i];
                for (var j = 0; j < equipos.length; j++){
                    if (equipos[j].id == equipo.id){
                        equipos[j][varPuesto] = equipo[varPuesto];
                    }
                }
            }
        }
        
        function grupoCompleto(equipos){
            for (var i=0; i<equipos.length; i++) {
               if (equipos[i].jugados < 3) {
                   return false; 
               }
            }
            return true;
        }
        
        function todosGruposCompletos(grupos){
            for (var i=0; i<grupos.length;i++){
                if (!grupoCompleto(grupos[i].equipos)) return false;
            }
            return true;
        }
        
        function hayResultado(golesLocal, golesVisitante){
            if (golesLocal === undefined || golesLocal === null || golesLocal === ""){
                return false;
            }
            if (golesVisitante === undefined || golesVisitante === null || golesVisitante === ""){
                return false;
            }
            return true;
        }
        
        function setOctavos (equipos, nombreGrupo, octavosAlta, octavosBaja, octavos){
            equipos.forEach(function(equipo){
               var pos = equipo.puesto+nombreGrupo; 
               setEquipoOctavos(octavosAlta, pos, equipo);
               setEquipoOctavos(octavosBaja, pos, equipo);
               setEquipoOctavos(octavos, pos, equipo);
            });
        }
        
        function setEquipoOctavos(octavos, pos, equipo){
             octavos.forEach(function(octavo){
                  if  (octavo.rondaAnteriorLocal == pos){
                      octavo.equipoLocal = equipo;
                  }
                  if (octavo.rondaAnteriorVisitante == pos){
                      octavo.equipoVisitante = equipo;
                  }
               });
        }
        
        function setTercerosOctavos(grupos, octavosAlta, octavosBaja, octavos){
            var terceros = getTerceros(grupos);
            var mejoresTerceros = getMejoresTerceros(terceros);
            var combinacionTerceros = getCombinacionTerceros(mejoresTerceros);
            var cruces = combinacionesTercerosGrupos[combinacionTerceros];
            for (var comb in cruces) {
               grupo = cruces[comb];
               var pos = 3+comb; 
               var equipo = getTerceroGrupo(grupo, mejoresTerceros);
               setEquipoOctavos(octavosAlta, pos, equipo);
               setEquipoOctavos(octavosBaja, pos, equipo);
               setEquipoOctavos(octavos, pos, equipo);
            }
        }
        
        function getTerceros(grupos){
            var grupo;
            var terceros = [];
            var equipo;
            for (var i=0; i<grupos.length; i++){
                grupo = grupos[i];
                for (var j=0; j<grupo.equipos.length; j++){
                    equipo = grupo.equipos[j];
                    if (equipo.puesto == 3) {
                        terceros.push(equipo);
                    }
                }
            }
            return terceros;
        }
        
        function getMejoresTerceros(terceros){
            var mejoresTerceros = [];
            ordenarPuestos(terceros, 1, false, true, false);
            var empates = getEmpates(terceros, true);
            // Desempate golaverage general
            for (var i = 0; i < empates.length; i++){
                if (empates[i] != null){
                    equiposEmpatados = setDatosEquipos(empates[i], terceros);
                    ordenarPuestos(equiposEmpatados, i, true, true, false);
                    setNuevosPuestos(equiposEmpatados, terceros, true);
                }
            }
            // Desempate orden alfabético
            empates = getEmpates(terceros, true);
            for (var i = 0; i < empates.length; i++){
                if (empates[i] != null){
                    equiposEmpatados = setDatosEquipos(empates[i], terceros);
                    ordenarPuestos(equiposEmpatados, i, true, true, true);
                    setNuevosPuestos(equiposEmpatados, terceros, true);
                }
            }
            for(var i = 0; i< terceros.length; i++){
                if (terceros[i].puestoTercero<=4) {
                    mejoresTerceros.push(terceros[i]);
                }
            }
            return mejoresTerceros;
        }
        
        function setDatosEquipos(equiposEmp, equipos){
            var equiposEmpatados = [];
            for (var i=0; i<equiposEmp.length; i++) {
                for (var j=0; j<equipos.length; j++){
                    if (equiposEmp[i] == equipos[j].id) {
                        equiposEmpatados.push(equipos[j]);
                    }
                }
            }
            return equiposEmpatados;
        }
        
        function getCombinacionTerceros(mejoresTerceros){
            var combinacion = [];
            for(var i=0; i<mejoresTerceros.length; i++){
                combinacion.push(mejoresTerceros[i].grupo);
            }
            return combinacion.sort().join("");
        }
        
        function getTerceroGrupo(grupo, terceros){
            for(var i=0; i < terceros.length; i++){
                if (terceros[i].grupo == grupo) return terceros[i];
            }
            return null;
        }
	};

}());