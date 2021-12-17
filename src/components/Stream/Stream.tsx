import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import ss from 'socket.io-stream';

import useInterval from '../../hooks/useInterval';
import StreamMicIcon from '../../icons/StreamMicIcon';
import './Stream.scss';

const Stream: React.FC<{}> = () => {
  const [isRecordActive, setIsRecordActive] = useState<boolean>(false);
  const [beginDate] = useState<Date>(new Date());
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [width, setWidth] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useInterval(() => {}, 0);

  function dateNormalize(date: number): string {
    return String(date).length === 1 ? `0${date}` : `${date}`;
  }

  useEffect(() => {
    if (isRecordActive && !mediaStream) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          const email = 'example@email.ru';

          setMediaStream(stream);
          //для визуализации звука
          const audioContext = new AudioContext();
          const src = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          const processor = audioContext.createScriptProcessor(2048, 1);
          src.connect(analyser);
          src.connect(processor);
          processor.connect(audioContext.destination);
          analyser.fftSize = 128;
          const data = new Uint8Array(analyser.frequencyBinCount);
          let counter = 0;
          processor.onaudioprocess = function () {
            analyser.getByteFrequencyData(data);
            if (counter >= 5 && data[5] !== 0) {
              setWidth && setWidth(data[5]);
              counter = 0;
            }
            counter += 1;
          };
          //предпоказ видео
          const video =
            videoRef && videoRef.current ? videoRef.current : undefined;
          if (video) {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
              video.play();
            };
          }

          //Соединение с сервером
          const socket =
            process.env.REACT_APP_ENV === 'dev'
              ? io(`${process.env.REACT_APP_BASE_URL}:3001`)
              : io(
                  process.env.REACT_APP_BASE_URL
                    ? process.env.REACT_APP_BASE_URL
                    : '',
                  {
                    path: '/video-socket',
                  },
                );

          function record_and_send(stream: MediaStream) {
            const videoRecorder = new MediaRecorder(stream, {
              mimeType: 'video/webm;codec=vp9',
            });
            const chunks: Blob[] = [];
            videoRecorder.ondataavailable = (e) => chunks.push(e.data);
            videoRecorder.onstop = (e) => {
              const date = new Date();
              const stream = ss.createStream();
              const blob = new Blob(chunks);
              ss(socket).emit('videoStream', stream, {
                email: email.slice(0, email.indexOf('@')),
                counter: `${date.getFullYear()}-${dateNormalize(
                  date.getMonth() + 1,
                )}-${dateNormalize(date.getDate())}-${dateNormalize(
                  date.getHours(),
                )}-${dateNormalize(date.getMinutes())}-${dateNormalize(
                  date.getSeconds(),
                )}`,
                size: blob.size,
                begin: `${beginDate.getFullYear()}-${dateNormalize(
                  beginDate.getMonth() + 1,
                )}-${dateNormalize(beginDate.getDate())}-${dateNormalize(
                  beginDate.getHours(),
                )}-${dateNormalize(beginDate.getMinutes())}-${dateNormalize(
                  beginDate.getSeconds(),
                )}`,
              });
              ss.createBlobReadStream(blob).pipe(stream);
            };
            videoRecorder.state === 'inactive' &&
              stream.active &&
              videoRecorder.start();
            setTimeout(() => {
              if (videoRecorder) {
                if (videoRecorder.state !== 'inactive') {
                  videoRecorder.stop();
                  record_and_send(stream);
                }
              }
            }, 10000);
          }
          record_and_send(stream);
        });
    } else {
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => {
          t.stop();
        });
        setMediaStream(null);
      }
    }
  }, [isRecordActive]);

  return (
    <section className="stream">
      <div className="stream__full-container">
        <video ref={videoRef} className="stream__video" muted />
        <div className="stream__right-container">
          <div className="stream__mic-container">
            <StreamMicIcon
              className="stream__mic-img"
              fill={`stream__mic-img-fill${
                width > 45 ? ' stream__mic-img-fill_active' : ''
              }`}
            />
            <StreamMicIcon
              className="stream__mic-img"
              fill={`stream__mic-img-fill${
                width > 60 ? ' stream__mic-img-fill_active' : ''
              }`}
            />
            <StreamMicIcon
              className="stream__mic-img"
              fill={`stream__mic-img-fill${
                width > 75 ? ' stream__mic-img-fill_active' : ''
              }`}
            />
            <StreamMicIcon
              className="stream__mic-img"
              fill={`stream__mic-img-fill${
                width > 90 ? ' stream__mic-img-fill_active' : ''
              }`}
            />
            <StreamMicIcon
              className="stream__mic-img"
              fill={`stream__mic-img-fill${
                width > 105 ? ' stream__mic-img-fill_active' : ''
              }`}
            />
            <StreamMicIcon
              className="stream__mic-img"
              fill={`stream__mic-img-fill${
                width > 120 ? ' stream__mic-img-fill_active' : ''
              }`}
            />
            <StreamMicIcon
              className="stream__mic-img"
              fill={`stream__mic-img-fill${
                width > 135 ? ' stream__mic-img-fill_active' : ''
              }`}
            />
            <StreamMicIcon
              className="stream__mic-img"
              fill={`stream__mic-img-fill${
                width > 150 ? ' stream__mic-img-fill_active' : ''
              }`}
            />
            <StreamMicIcon
              className="stream__mic-img"
              fill={`stream__mic-img-fill${
                width > 165 ? ' stream__mic-img-fill_active' : ''
              }`}
            />
            <StreamMicIcon
              className="stream__mic-img"
              fill={`stream__mic-img-fill${
                width > 180 ? ' stream__mic-img-fill_active' : ''
              }`}
            />
          </div>
          <div className="stream__button-container">
            <button
              className="stream__button"
              onClick={() => {
                setIsRecordActive(true);
              }}
            >
              Начать запись
            </button>
            <button
              className="stream__button"
              onClick={() => {
                setIsRecordActive(false);
              }}
            >
              Остановить
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stream;
