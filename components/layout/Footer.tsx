export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-base-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-500">
            বাজার দর - প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
        </div>

        <p className="text-sm text-gray-500">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}