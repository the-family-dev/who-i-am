"use client";
import type { SpringOptions } from "motion/react";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { TUser } from "@/server/types";
import { CrownIcon, GlobeOffIcon, PlugZap2Icon } from "lucide-react";

interface UserCardProps {
  height?: React.CSSProperties["height"];
  width?: React.CSSProperties["width"];
  user: TUser;
  secret: string;
}

const springValues: SpringOptions = {
  damping: 10,
  stiffness: 100,
  mass: 1,
};

const scaleOnHover = 1.1;
const rotateAmplitude = 14;

export default function UserCard({
  width = 240,
  height = 360,
  user,
  secret,
}: UserCardProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="relative w-full h-full perspective-midrange flex flex-col items-center justify-center select-none"
      style={{
        height: height,
        width: width,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative transform-3d"
        style={{
          width: width,
          height: height,
          rotateX,
          rotateY,
          scale,
        }}
      >
        <motion.img
          src={"/card3.png"}
          draggable={false}
          alt={"Card image"}
          className="absolute top-0 left-0 object-cover rounded-[15px] will-change-transform transform-[translateZ(0)]"
          style={{
            width: width,
            height: height,
          }}
        />

        {user.isAdmin && (
          <motion.div className="absolute top-2 right-2 bg-white p-2 rounded-xl">
            <CrownIcon className="size-5 text-danger" />
          </motion.div>
        )}

        {user.disconnected && (
          <motion.div className="absolute top-2 left-2 bg-white p-2 rounded-xl">
            <GlobeOffIcon className=" size-5 text-slate-500" />
          </motion.div>
        )}

        <motion.div className="absolute left-1/2 bottom-15 -translate-x-1/2 leading-none text-default w-28 h-13 overflow-hidden text-ellipsis line-clamp-3 text-center">
          {user.name}
        </motion.div>

        <motion.textarea
          disabled
          defaultValue={secret}
          className="absolute resize-none left-1/2 bottom-44 -translate-x-1/2 leading-none text-xl text-default w-40 h-25"
        />
      </motion.div>
    </figure>
  );
}
