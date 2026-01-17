"""
Calibración del exponente para la campana.

La fórmula general es: V = V_total × (h/H)^n

Donde n puede ser:
- n = 1: Proporcionalidad lineal (cilindro)
- n = 2: Proporcional al cuadrado (paraboloide)
- n = 3: Proporcional al cubo (cono perfecto)

Vamos a encontrar qué exponente se ajusta mejor a la experiencia:
"5 pulgadas de espacio ≈ 10-15 galones vacíos"
"""

# Datos del tanque F12
TOP_INCHES = 19.90
GALS_IN_TOP = 263.282

print("=" * 70)
print("CALIBRACIÓN DEL EXPONENTE PARA LA CAMPANA")
print("=" * 70)
print(f"\nObjetivo: 5 pulgadas de espacio = 10-15 galones vacíos")
print(f"Campana F12: {TOP_INCHES} pulgadas de alto, {GALS_IN_TOP} galones totales")

print("\n┌───────────┬────────────────────┬─────────────────────────────────┐")
print("│ Exponente │ 5 pulg = X galones │ Descripción                     │")
print("├───────────┼────────────────────┼─────────────────────────────────┤")

for n in [1.0, 1.5, 2.0, 2.5, 3.0]:
    ratio = 5 / TOP_INCHES
    gals = GALS_IN_TOP * (ratio ** n)
    
    if n == 1.0:
        desc = "Lineal (cilindro)"
    elif n == 2.0:
        desc = "Cuadrático (paraboloide)"
    elif n == 3.0:
        desc = "Cúbico (cono perfecto)"
    else:
        desc = f"Intermedio"
    
    match = "✅" if 10 <= gals <= 15 else "  "
    print(f"│ {n:9.1f} │ {gals:18.2f} │ {desc:31} │ {match}")

print("└───────────┴────────────────────┴─────────────────────────────────┘")

# Encontrar el exponente exacto para 12.5 galones (punto medio de 10-15)
import math

target_gals = 12.5  # Punto medio de 10-15
ratio = 5 / TOP_INCHES

# V = V_total × ratio^n
# target = GALS_IN_TOP × ratio^n
# target / GALS_IN_TOP = ratio^n
# log(target / GALS_IN_TOP) = n × log(ratio)
# n = log(target / GALS_IN_TOP) / log(ratio)

n_exact = math.log(target_gals / GALS_IN_TOP) / math.log(ratio)

print(f"\n📐 Exponente calculado para obtener ~12.5 galones: n = {n_exact:.2f}")

print("\n" + "=" * 70)
print(f"TABLA COMPLETA CON EXPONENTE n = {n_exact:.2f}")
print("=" * 70)

print("\n┌─────────────┬──────────────────┬──────────────────────────────────┐")
print("│ Espacio (in)│ Galones vacíos   │ Vino en tanque (de 6561.72 gal)  │")
print("├─────────────┼──────────────────┼──────────────────────────────────┤")

for space in [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 19.90]:
    if space >= TOP_INCHES:
        empty = GALS_IN_TOP
    else:
        ratio = space / TOP_INCHES
        empty = GALS_IN_TOP * (ratio ** n_exact)
    
    wine = 6561.717 - empty
    print(f"│ {space:11.2f} │ {empty:16.2f} │ {wine:32.2f} │")

print("└─────────────┴──────────────────┴──────────────────────────────────┘")

print("\n" + "=" * 70)
print("RECOMENDACIÓN FINAL")
print("=" * 70)
print(f"""
Basado en tu experiencia de 5 años, el exponente que mejor se ajusta es:

    n ≈ {n_exact:.1f} (redondeado a 2.2)

Esto sugiere que la campana tiene una forma entre:
- Paraboloide (n=2): Como un plato hondo
- Cono (n=3): Como un embudo

La fórmula recomendada para la campana es:

    galones_vacíos = GALS_IN_TOP × (espacio / TOP_INCHES)^2.2

Esta fórmula dará resultados más precisos que:
- La proporcionalidad lineal (que sobreestima)
- La fórmula del cono puro (que subestima)
""")
