"use client";

import React from "react";
// import Image from "next/image";
import { useRouter } from "next/navigation";
// import MainBanner from "@/assets/img/MainBanner.png";
import MainFeatureCard from "@/components/MainFeatureCard";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";

export default function StartPage() {
  const router = useRouter();

  return (
    <div className="flex flex-row lg:space-x-10 justify-center items-center mx-auto min-h-screen p-6">
      {/* <Image
        src={MainBanner}
        alt="Main Banner"
        width={700}
        height={400}
        className="rounded-lg shadow-lg"
      /> */}
      <VideoPlayer
        src="/video/MainVideo.mp4"
        className="w-full lg:w-2/3 h-64 lg:h-auto mb-8 lg:mb-0"
      />
      <div className="mt-10 lg:mt-0 text-center lg:text-left px-4">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          CollaboDocs
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          협업 문서 공유 및 실시간 채팅 웹사이트
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <MainFeatureCard
            title="실시간 문서 편집"
            description="실시간으로 문서를 편집하세요."
          />
          <MainFeatureCard
            title="실시간 채팅"
            description="팀원들과 즉시 소통하세요."
          />
          <MainFeatureCard
            title="협업 도구"
            description="문서 편집, 협업, 즉시 소통을 위한 다양한 도구를 즐기세요."
          />
          <MainFeatureCard
            title="효율적인 협업"
            description="실시간으로 문서를 편집하고, 팀원들과 즉시 소통하세요."
          />
        </div>
        <Button
          onClick={() => router.push("/signin")}
          className="w-full mt-12  bg-gray-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          시작하기
        </Button>
      </div>
    </div>
  );
}
