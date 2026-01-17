"""
Análisis matemático de la campana cónica de los tanques de vino.

Un cono tiene la propiedad de que su volumen es proporcional al CUBO de la altura.
V = (1/3) × π × r² × h

Si tenemos un cono donde:
- Altura total = H
- Volumen total = V_total

El volumen desde la punta hasta una altura h es:
V(h) = V_total × (h/H)³

Esto significa que el volumen NO es lineal con la altura.
"""

import math

# Datos del tanque F12 como ejemplo
tank_f12 = {
    "GALS_PER_INCH": 44.678,
    "GALS_IN_TOP": 263.282,
    "TOP_INCHES": 19.90,
    "TOTAL_GALS": 6561.717
}

print("=" * 60)
print("ANÁLISIS DE LA CAMPANA CÓNICA - TANQUE F12")
print("=" * 60)
print(f"\nDatos de la campana:")
print(f"  - Altura de la campana (TOP_INCHES): {tank_f12['TOP_INCHES']} pulgadas")
print(f"  - Galones en la campana (GALS_IN_TOP): {tank_f12['GALS_IN_TOP']} galones")
print(f"  - Capacidad total del tanque: {tank_f12['TOTAL_GALS']} galones")

print("\n" + "=" * 60)
print("COMPARACIÓN: PROPORCIONALIDAD LINEAL vs FÓRMULA DEL CONO")
print("=" * 60)

# La campana está en la parte SUPERIOR del tanque
# Cuando medimos "espacio vacío", medimos desde ARRIBA hacia ABAJO
# 
# Visualización:
#     ___     <- Boca del tanque (arriba)
#    /   \    <- Campana cónica (se mide desde aquí)
#   /     \
#  /_______\  <- Base de la campana (TOP_INCHES desde arriba)
#  |       |
#  | CUERPO|  <- Cuerpo cilíndrico
#  |_______|
#
# Si el espacio vacío = 5 pulgadas, significa que el vino está a 5" de la boca
# El vino llena: (TOP_INCHES - 5) pulgadas de la campana + todo el cuerpo

def calc_cone_volume_from_top(space_inches, top_inches, gals_in_top):
    """
    Calcula los galones VACÍOS en la campana cuando se mide desde arriba.
    
    La campana es un cono con la PUNTA hacia ARRIBA (la boca del tanque).
    Cuando medimos 'space_inches' desde arriba, estamos midiendo
    la altura del espacio vacío desde la punta del cono.
    
    Para un cono con punta arriba:
    - Volumen vacío = V_total × (space / height)³
    """
    if space_inches <= 0:
        return 0
    if space_inches >= top_inches:
        return gals_in_top
    
    # Fórmula del cono: V = V_total × (h/H)³
    ratio = space_inches / top_inches
    empty_gallons = gals_in_top * (ratio ** 3)
    return empty_gallons

def calc_linear_volume(space_inches, top_inches, gals_in_top):
    """
    Calcula los galones vacíos usando proporcionalidad lineal (INCORRECTA para cono).
    """
    if space_inches <= 0:
        return 0
    if space_inches >= top_inches:
        return gals_in_top
    
    ratio = space_inches / top_inches
    return gals_in_top * ratio

print("\n┌─────────────┬──────────────────┬──────────────────┬─────────────┐")
print("│ Espacio (in)│ Lineal (gal)     │ Cono (gal)       │ Diferencia  │")
print("├─────────────┼──────────────────┼──────────────────┼─────────────┤")

for space in [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 19.90]:
    linear = calc_linear_volume(space, tank_f12['TOP_INCHES'], tank_f12['GALS_IN_TOP'])
    cone = calc_cone_volume_from_top(space, tank_f12['TOP_INCHES'], tank_f12['GALS_IN_TOP'])
    diff = linear - cone
    print(f"│ {space:11.2f} │ {linear:16.2f} │ {cone:16.2f} │ {diff:+11.2f} │")

print("└─────────────┴──────────────────┴──────────────────┴─────────────┘")

print("\n" + "=" * 60)
print("VALIDACIÓN CON TU EXPERIENCIA")
print("=" * 60)
print("\nSegún tu experiencia: 5 pulgadas de espacio ≈ 10-15 galones vacíos")

space_5 = 5
linear_5 = calc_linear_volume(space_5, tank_f12['TOP_INCHES'], tank_f12['GALS_IN_TOP'])
cone_5 = calc_cone_volume_from_top(space_5, tank_f12['TOP_INCHES'], tank_f12['GALS_IN_TOP'])

print(f"\nCon 5 pulgadas de espacio en F12:")
print(f"  - Cálculo LINEAL: {linear_5:.2f} galones vacíos")
print(f"  - Cálculo CONO:   {cone_5:.2f} galones vacíos")
print(f"  - Tu experiencia: 10-15 galones vacíos")

print("\n" + "=" * 60)
print("CONCLUSIÓN")
print("=" * 60)

if 10 <= cone_5 <= 20:
    print("\n✅ La fórmula del CONO coincide mejor con tu experiencia!")
else:
    print(f"\n⚠️ La fórmula del cono da {cone_5:.2f} galones.")
    print("   Puede que la campana no sea un cono perfecto.")

# Ahora calculemos el ejemplo completo con 120 pulgadas
print("\n" + "=" * 60)
print("EJEMPLO COMPLETO: F12 con 120 pulgadas de espacio")
print("=" * 60)

space_total = 120
top_inches = tank_f12['TOP_INCHES']
gals_per_inch = tank_f12['GALS_PER_INCH']
gals_in_top = tank_f12['GALS_IN_TOP']
total_gals = tank_f12['TOTAL_GALS']

# El espacio incluye toda la campana + parte del cuerpo
body_space = space_total - top_inches
body_empty_gals = body_space * gals_per_inch
total_empty = body_empty_gals + gals_in_top
wine_gallons = total_gals - total_empty

print(f"\n1. Espacio en cuerpo: {space_total} - {top_inches} = {body_space:.2f} pulgadas")
print(f"2. Galones vacíos en cuerpo: {body_space:.2f} × {gals_per_inch} = {body_empty_gals:.2f}")
print(f"3. Galones vacíos totales: {body_empty_gals:.2f} + {gals_in_top} = {total_empty:.2f}")
print(f"4. Galones de vino: {total_gals} - {total_empty:.2f} = {wine_gallons:.2f}")
print(f"\n✅ Resultado: {wine_gallons:.2f} galones de vino")
