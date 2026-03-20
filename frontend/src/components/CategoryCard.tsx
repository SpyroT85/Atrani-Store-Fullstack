export interface CategoryCardProps {
  image: string;
  title: string;
}

const CategoryCard = ({ image, title }: CategoryCardProps) => {
  const imageStyle: React.CSSProperties = {
    width: 'clamp(150px, 24vw, 220px)',
    height: 'clamp(150px, 24vw, 220px)',
    transform: title === 'Inkwells' ? 'translateX(20px)' : 'none',
    filter: 'drop-shadow(0 16px 24px rgba(0,0,0,0.65))',
  };
  return (
    <div className="flex flex-col items-center cursor-pointer transition relative w-full max-w-70 mx-auto" style={{ paddingTop: '3rem' }}>
      <div className="flex items-center justify-center" style={{ position: 'relative', zIndex: 2, marginBottom: '-6rem' }}>
        <img src={image} alt={`${title}`} className="object-contain" style={imageStyle} width="200" height="200" loading="lazy" />
      </div>
      <div className="w-full rounded-xl flex flex-col items-center" style={{ backgroundColor: '#F3F4F6', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', paddingTop: '7rem', paddingBottom: '2.5rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <h3 className="font-bold uppercase tracking-wider text-black" style={{ fontSize: '15px', letterSpacing: '0.1em' }}>{title}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;
