interface FooterCopyrightProps {
  copyright: string;
}

export default function FooterCopyright({ copyright }: FooterCopyrightProps) {
  return (
    <div className="border-t border-gray-300 mt-12 pt-8 text-center text-gray-500">
      <p>{copyright}</p>
    </div>
  );
}
