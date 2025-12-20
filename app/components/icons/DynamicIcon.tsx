import {
    MapPin,
    Box,
    Lightbulb,
    TreePine,
    Trash2,
    Building2,
    Zap,
    AlertTriangle,
    Bus,
    Search,
    Landmark,
    Droplet
} from 'lucide-react'

export const IconMap: Record<string, any> = {
    'map-pin': MapPin,
    'box': Box,
    'lightbulb': Lightbulb,
    'tree-pine': TreePine,
    'trash-2': Trash2,
    'building-2': Building2,
    'zap': Zap,
    'alert-triangle': AlertTriangle,
    'bus': Bus,
    'search': Search,
    'landmark': Landmark,
    'droplet': Droplet
}

export function DynamicIcon({ name, className }: { name: string, className?: string }) {
    const IconComponent = IconMap[name] || Box
    return <IconComponent className={className} />
}
