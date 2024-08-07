import Link from 'next/link';

const Hero = () => {
  return (
    <section className="pt-24 md:pt-36 pb-20 bg-gradient-to-r from-primary to-secondary !overflow-hidden text-white">
      <div className=" !remove-scrollbar1 container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeIn">Vote Électronique Sécurisé et Pratique</h1>
        <p className="text-xl mb-8 animate-fadeIn">Renforcez la démocratie avec notre plateforme de vote électronique de pointe</p>
        <Link href={'/sign-in'} className="bg-white text-primary font-bold py-3 px-8 rounded-full hover:bg-accent transition-colors animate-fadeIn">
          Commencer
        </Link>
      </div>
    </section>
  );
};

export default Hero;
