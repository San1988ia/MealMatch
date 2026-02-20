type RecipeCardProps = {
  title: string;
  subtitle?: string;
  tags?: string[];
};

export function RecipeCard({ title, subtitle, tags = [] }: RecipeCardProps) {
  return (
    <article className="recipe-card">
      <div className="recipe-card__image" aria-hidden="true" />

      <div className="recipe-card__body">
        <h3 className="recipe-card__title">{title}</h3>
        {subtitle ? <p className="recipe-card__subtitle">{subtitle}</p> : null}

        {tags.length > 0 ? (
          <div className="recipe-card__tags">
            {tags.map((t) => (
              <span key={t} className="recipe-card__tag">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
