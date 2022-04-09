import { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Post } from "../lib/database/data/post";
import lottie, { AnimationItem } from "lottie-web";
import hearthLottie from "../public/lottie/hearth.json";
import { BackendServiceContext } from "../lib/contexts/BackendServiceContext";
import useSWR, { mutate } from "swr";

export default function PostLike(props: { post: Post }) {
  const [cookie] = useCookies(["bearerToken"]);
  const backendService = useContext(BackendServiceContext);

  const { data: active } = useSWR(
    `/posts/${props.post.id}/likes/me`,
    async () =>
      await backendService.isPostLikedByMe(props.post.id, cookie.bearerToken),
    {
      onSuccess: (data) => {
        if (active === undefined || anim.current?.currentFrame === 0) {
          anim.current?.goToAndStop(data ? 66 : 19, true);
        } else if (active != data) {
          if (data) {
            anim.current?.playSegments([19, 50], true);
          } else {
            anim.current?.playSegments([0, 19], true);
          }
        }
      },
      fallbackData: false,
    }
  );
  const { data: count } = useSWR(
    "/posts/" + props.post.id + "/likes",
    async () =>
      await backendService.getLikesCountByPostId(
        props.post.id,
        cookie.bearerToken
      )
  );

  const animationContainer = useRef(null);
  const anim = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (animationContainer.current) {
      anim.current = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: hearthLottie,
      });
      return () => anim.current?.destroy();
    }
  }, []);

  return (
    <>
      <div
        className={`h-16 w-16 relative bottom-5 umami--click--like-button ${
          active
            ? "text-gray-900 dark:text-red-500"
            : "text-gray-200 dark:text-white"
        }`}
        ref={animationContainer}
        onClick={async () => {
          if (!active) {
            await backendService.createLikeByPostId(
              props.post.id,
              cookie.bearerToken
            );
          } else {
            await backendService.deleteLikeByPostId(
              props.post.id,
              cookie.bearerToken
            );
          }
          mutate("/posts/" + props.post.id + "/likes");
          mutate("/posts/" + props.post.id + "/likes/me");
        }}
      />
      <span className="relative right-3">{count}</span>
    </>
  );
}
