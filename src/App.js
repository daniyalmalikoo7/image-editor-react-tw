import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRef, useState, useCallback, useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Slider from "./components/Slider";
import { db, storage } from "./firebase";
import { toPng } from "html-to-image";

const DEFAULT_OPTIONS = [
  {
    name: "Brightness",
    property: "brightness",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Opacity",
    property: "opacity",
    value: 100,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Contrast",
    property: "contrast",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Saturation",
    property: "saturate",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Grayscale",
    property: "grayscale",
    value: 0,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Sepia",
    property: "sepia",
    value: 0,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Hue",
    property: "hue-rotate",
    value: 0,
    range: {
      min: 0,
      max: 360,
    },
    unit: "deg",
  },
  {
    name: "Blur",
    property: "blur",
    value: 0,
    range: {
      min: 0,
      max: 20,
    },
    unit: "px",
  },
];

function App() {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const filePickerRef = useRef();
  const refImg = useRef(HTMLDivElement);

  const handleSliderChange = (e) => {
    setOptions((prevOptions) => {
      return prevOptions.map((option, index) => {
        if (index !== selectedOptionIndex) return option;
        return { ...option, value: e.target.value };
      });
    });
  };

  const addImageToEdit = (e) => {
    // sets a file in a state full way so we get the file in a kind of an object

    const reader = new FileReader();

    // AddImageToEdit

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImageUrl(readerEvent.target.result);
    };
  };

  const handleUpload = async () => {
    // UploadImage
    // 1. Create a firestore 'images' collection  with timestamp
    // 2. get the doc id with timestamp for the newly created doc
    // 3. update the image to the firebase storage with the doc id
    // 4. get the dowloadURL from firebase storage and update the original post

    const docRef = await addDoc(collection(db, "images"), {
      Timestamp: serverTimestamp(),
    });

    console.log("New Doc added with ID", docRef.id);

    const imageRefInStorage = ref(storage, `images/${docRef.id}`);
    await uploadString(imageRefInStorage, editedImage, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRefInStorage);
        await updateDoc(doc(db, "images", docRef.id), {
          image: downloadURL,
        });

        setUploadImage(downloadURL);
      }
    );
  };

  function getImageStyle() {
    const filters = options.map(
      (option) => `${option.property}(${option.value}${option.unit})`
    );

    //filters return an array
    //we want to convert this into a style object
    return {
      filter: filters.join(" "),
    };
  }

  useEffect(() => {
    const img = new Image();
    setUploadImage(imageUrl);
    img.src = uploadImage;
    img.onload = () => {};
  }, [imageUrl, uploadImage]);

  const donwloadEditImage = useCallback(() => {
    if (refImg.current === null) {
      return;
    }

    toPng(refImg.current, { cacheBust: true })
      .then((dataUrl) => {
        setEditedImage(dataUrl);
        const link = document.createElement("a");
        link.download = "image.png";
        link.href = dataUrl;
        link.click();
        if (editedImage) handleUpload();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refImg, editedImage, handleUpload]);

  return (
    <>
      <Header />
      <h2 className="text-md text-gray-700 text-center p-5">
        Click to select the effect and drag the slider sideways to adjust the
        corresponding image effect.
      </h2>
      <div className="grid sm:grid-cols-2 sm:gaps-4 w-[100vw]">
        {/*left  */}
        <div className="my-auto">
          {options.map((option, index) => (
            <Slider
              key={index}
              name={option.name}
              active={index === selectedOptionIndex}
              value={option.value}
              handleClick={() => setSelectedOptionIndex(index)}
              handleChange={handleSliderChange}
              min={option.range.min}
              max={option.range.max}
            />
          ))}
        </div>
        {/* right */}
        <div className="p-2 h-[500px] relative">
          {!uploadImage ? (
            <div
              onClick={() => filePickerRef.current.click()}
              className="flex flex-col items-center justify-between absolute h-[150px] w-[300px] shadow-xl rounded-lg bg-teal-400  top-[40%] p-5 text-white"
            >
              <h4 className="text-center animate-pulse cursor-pointer font-bold">
                Click me to <b>SELECT</b> image you want to edit.
              </h4>
              <input
                className="text-sm hidden"
                type="file"
                ref={filePickerRef}
                accept=".jpeg, .jpg, .png"
                onChange={(e) => addImageToEdit(e)}
              />
            </div>
          ) : (
            <div
              ref={refImg}
              style={{
                ...getImageStyle(),
                backgroundImage: `url('${uploadImage}')`,
              }}
              className={`${
                uploadImage ? "" : "hidden"
              } hover:bg-gray-100 z-40 bg-no-repeat bg-center bg-contain h-[480px]`}
            />
          )}

          {uploadImage && (
            <button
              onClick={donwloadEditImage}
              className="bg-teal-500 text-white py-2 px-3 z-50  absolute top-2 left-2"
            >
              Download Image
            </button>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
