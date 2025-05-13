import { ScrollArea } from "@/components/ui/scroll-area"

export default function TranscriptView() {
  // Datos simulados para la transcripción
  const transcript = [
    {
      speaker: "Carlos",
      time: "00:00:15",
      text: "Buenos días a todos. Gracias por unirse a esta reunión de planificación trimestral. Hoy vamos a discutir los objetivos para el próximo trimestre y revisar el estado de nuestros proyectos actuales.",
    },
    {
      speaker: "María",
      time: "00:00:32",
      text: "Gracias, Carlos. Antes de comenzar, ¿podemos hacer un repaso rápido de los puntos pendientes de la última reunión?",
    },
    {
      speaker: "Carlos",
      time: "00:00:45",
      text: "Claro, María. Teníamos tres puntos principales: la finalización del Proyecto Alpha, el lanzamiento de la Iniciativa Beta y la planificación inicial para el Lanzamiento Gamma.",
    },
    {
      speaker: "Juan",
      time: "00:01:10",
      text: "Respecto al Proyecto Alpha, hemos avanzado significativamente. El equipo de desarrollo completó el 80% de las funcionalidades planificadas, pero estamos enfrentando algunos desafíos con la integración de APIs externas.",
    },
    {
      speaker: "María",
      time: "00:01:35",
      text: "En cuanto a la Iniciativa Beta, tenemos algunos retrasos debido a problemas con el proveedor. Necesitamos discutir alternativas hoy.",
    },
    {
      speaker: "Laura",
      time: "00:02:05",
      text: "El equipo de marketing ya comenzó a trabajar en la estrategia para el Lanzamiento Gamma. Tenemos un borrador inicial que podemos revisar hoy si hay tiempo.",
    },
    {
      speaker: "Carlos",
      time: "00:02:30",
      text: "Excelente. Entonces, comencemos con el Proyecto Alpha. Juan, ¿puedes darnos más detalles sobre los desafíos que están enfrentando?",
    },
    {
      speaker: "Juan",
      time: "00:02:45",
      text: "Por supuesto. El principal problema es la latencia en las respuestas de la API del proveedor. Estamos trabajando con ellos para optimizar las llamadas, pero esto podría retrasar la entrega final en aproximadamente una semana.",
    },
    {
      speaker: "Carlos",
      time: "00:03:10",
      text: "¿Necesitan recursos adicionales para mantenerse en el cronograma original?",
    },
    {
      speaker: "Juan",
      time: "00:03:20",
      text: "Sí, un desarrollador adicional con experiencia en optimización de APIs sería de gran ayuda.",
    },
    {
      speaker: "Carlos",
      time: "00:03:35",
      text: "Entendido. Hablaré con Recursos Humanos para ver si podemos reasignar a alguien temporalmente. Ahora, María, hablemos sobre los problemas con el proveedor para la Iniciativa Beta.",
    },
  ]

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-900 p-6 shadow-md">
          <h3 className="mb-4 text-lg font-medium">Transcripción completa</h3>

          <div className="space-y-6">
            {transcript.map((entry, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-purple-400">{entry.speaker}</span>
                  <span className="text-xs text-gray-500">{entry.time}</span>
                </div>
                <p className="text-gray-300">{entry.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
