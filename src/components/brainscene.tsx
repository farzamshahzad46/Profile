import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

export interface Skill {
    name: string;
    category: string;
}

export interface Category {
    id: string;
    label: string;
    color: string;
}

/** Sample points that roughly fill a two-hemisphere brain silhouette. */
function buildBrainPoints(count: number, seed = 1) {
    // deterministic PRNG so the shape is stable between renders
    let s = seed;
    const rand = () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
    };

    const pts: THREE.Vector3[] = [];
    let guard = 0;
    while (pts.length < count && guard < count * 60) {
        guard++;
        const x = (rand() - 0.5) * 4.6;
        const y = (rand() - 0.5) * 3.2;
        const z = (rand() - 0.5) * 3.8;

        const e = (x / 2.1) ** 2 + (y / 1.45) ** 2 + (z / 1.65) ** 2;
        const c = (x / 1.1) ** 2 + ((y + 1.35) / 0.55) ** 2 + ((z + 1.5) / 0.7) ** 2;
        const st = (x / 0.28) ** 2 + ((y + 1.75) / 0.7) ** 2 + ((z + 0.75) / 0.28) ** 2;

        const inCerebrum = e < 1;
        if (!(inCerebrum || c < 1 || st < 1)) continue;

        if (inCerebrum) {
            const fold =
                0.16 * Math.sin(x * 5.5) * Math.sin(z * 4.5) + 0.12 * Math.sin(y * 6.5 + z * 3.0);
            const shell = Math.sqrt(e) + fold;
            if (shell < 0.72 && rand() > 0.12) continue;
            if (Math.abs(x) < 0.11 && y > -0.2 && rand() > 0.15) continue;
        }

        pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
}

/** Faint structural point cloud that gives the brain its silhouette. */
function BrainMist({ count }: { count: number }) {
    const positions = useMemo(() => {
        const pts = buildBrainPoints(count, 7);
        const arr = new Float32Array(pts.length * 3);
        pts.forEach((p, i) => {
            arr[i * 3] = p.x;
            arr[i * 3 + 1] = p.y;
            arr[i * 3 + 2] = p.z;
        });
        return arr;
    }, [count]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                color="#8a8f84"
                size={0.02}
                sizeAttenuation
                transparent
                opacity={0.32}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

/**
 * Skill nodes: one coloured dot per skill, positioned on the brain shell,
 * with faint synapse lines between nearby nodes.
 */
function SkillNodes({
    skills,
    categories,
    activeCategory,
}: {
    skills: Skill[];
    categories: Category[];
    activeCategory: string | null;
}) {
    const pointsRef = useRef<THREE.Points>(null);

    const { positions, colors, linePositions, nodeCategories } = useMemo(() => {
        // spread nodes over the brain volume deterministically
        const shell = buildBrainPoints(Math.max(skills.length * 8, 200), 23);
        const stride = Math.max(1, Math.floor(shell.length / skills.length));

        const positions = new Float32Array(skills.length * 3);
        const colors = new Float32Array(skills.length * 3);
        const nodeCategories: string[] = [];
        const chosen: THREE.Vector3[] = [];

        const colorFor = (categoryId: string) =>
            new THREE.Color(categories.find((c) => c.id === categoryId)?.color ?? "#dfff5b");

        skills.forEach((skill, i) => {
            const p = shell[(i * stride) % shell.length]!;
            chosen.push(p);
            positions[i * 3] = p.x;
            positions[i * 3 + 1] = p.y;
            positions[i * 3 + 2] = p.z;

            const c = colorFor(skill.category);
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
            nodeCategories.push(skill.category);
        });

        // connect nodes that are reasonably close
        const segs: number[] = [];
        for (let i = 0; i < chosen.length; i++) {
            for (let j = i + 1; j < chosen.length; j++) {
                if (chosen[i]!.distanceTo(chosen[j]!) < 1.5) {
                    segs.push(
                        chosen[i]!.x, chosen[i]!.y, chosen[i]!.z,
                        chosen[j]!.x, chosen[j]!.y, chosen[j]!.z
                    );
                }
            }
        }

        return {
            positions,
            colors,
            linePositions: new Float32Array(segs),
            nodeCategories,
        };
    }, [skills, categories]);

    // dim nodes that aren't in the active category
    const sizes = useMemo(() => {
        const arr = new Float32Array(nodeCategories.length);
        nodeCategories.forEach((cat, i) => {
            arr[i] = !activeCategory || cat === activeCategory ? 1 : 0.25;
        });
        return arr;
    }, [nodeCategories, activeCategory]);

    useFrame(() => {
        const pts = pointsRef.current;
        if (!pts) return;
        const attr = pts.geometry.getAttribute("color") as THREE.BufferAttribute | undefined;
        if (!attr) return;
        const arr = attr.array as Float32Array;
        for (let i = 0; i < sizes.length; i++) {
            const k = sizes[i]!;
            arr[i * 3] = colors[i * 3]! * k;
            arr[i * 3 + 1] = colors[i * 3 + 1]! * k;
            arr[i * 3 + 2] = colors[i * 3 + 2]! * k;
        }
        attr.needsUpdate = true;
    });

    return (
        <group>
            <lineSegments>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
                </bufferGeometry>
                <lineBasicMaterial
                    color="#6f7568"
                    transparent
                    opacity={0.16}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </lineSegments>

            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                    <bufferAttribute attach="attributes-color" args={[colors.slice(), 3]} />
                </bufferGeometry>
                <pointsMaterial
                    vertexColors
                    size={0.11}
                    sizeAttenuation
                    transparent
                    opacity={0.95}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
}

function Rig({
    mouse,
    children,
}: {
    mouse: MutableRefObject<[number, number]>;
    children: React.ReactNode;
}) {
    const group = useRef<THREE.Group>(null);
    const { size } = useThree();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (!group.current) return;
        // continuous slow spin - independent of scroll position
        group.current.rotation.y = t * 0.16;
        group.current.rotation.x = -0.08 + Math.sin(t * 0.25) * 0.05 + mouse.current[1] * 0.16;
        group.current.rotation.z = mouse.current[0] * 0.06;
        group.current.scale.setScalar(size.width < 768 ? 0.78 : 1);
    });

    return <group ref={group}>{children}</group>;
}

export default function BrainScene({
    mouse,
    skills,
    categories,
    activeCategory,
}: {
    mouse: MutableRefObject<[number, number]>;
    skills: Skill[];
    categories: Category[];
    activeCategory: string | null;
}) {
    return (
        <Canvas
            camera={{ position: [0, 0, 6.2], fov: 45 }}
            flat
            dpr={[1, 1.8]}
            gl={{ antialias: true, alpha: true }}
        >
            <ambientLight intensity={0.6} />
            <Rig mouse={mouse}>
                <BrainMist count={2200} />
                <SkillNodes skills={skills} categories={categories} activeCategory={activeCategory} />
            </Rig>
        </Canvas>
    );
}