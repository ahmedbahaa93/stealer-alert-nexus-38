function Border({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-lg bg-gradient-to-b from-[#0F43B4] to-[#61E4AE] pl-1 transition-all duration-500 ease-in-out hover:from-[#61E4AE] hover:to-[#0F43B4] hover:scale-[1.03] transform-gpu">
            {children}
        </div>
    );
}

export default Border;
